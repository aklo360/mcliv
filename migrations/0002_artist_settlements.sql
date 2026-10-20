PRAGMA foreign_keys = ON;

CREATE TABLE settlements (
  id TEXT PRIMARY KEY, artistSlug TEXT NOT NULL, orderId TEXT NOT NULL, lineId TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1, createdAt TEXT NOT NULL,
  fundsCleared INTEGER NOT NULL DEFAULT 0 CHECK(fundsCleared IN (0,1)),
  recipientVerified INTEGER NOT NULL DEFAULT 0 CHECK(recipientVerified IN (0,1)),
  destinationRef TEXT, destinationLast4 TEXT, verificationNote TEXT,
  approved INTEGER NOT NULL DEFAULT 0 CHECK(approved IN (0,1)),
  issue TEXT, UNIQUE(orderId, lineId)
);
CREATE TABLE settlement_versions (
  settlementId TEXT NOT NULL REFERENCES settlements(id), revision INTEGER NOT NULL,
  terms TEXT NOT NULL, document TEXT NOT NULL, documentHash TEXT NOT NULL,
  entitlementCents INTEGER NOT NULL CHECK(entitlementCents >= 0),
  mclivSigner TEXT NOT NULL, mclivSignedAt TEXT NOT NULL, adminEmail TEXT NOT NULL,
  PRIMARY KEY(settlementId, revision)
);
CREATE TABLE settlement_signatures (
  settlementId TEXT NOT NULL, revision INTEGER NOT NULL,
  artistSigner TEXT NOT NULL, signedAt TEXT NOT NULL, consent TEXT NOT NULL,
  pdfBase64 TEXT NOT NULL, pdfHash TEXT NOT NULL,
  PRIMARY KEY(settlementId, revision),
  FOREIGN KEY(settlementId,revision) REFERENCES settlement_versions(settlementId,revision)
);
CREATE TABLE settlement_invites (
  tokenHash TEXT PRIMARY KEY, settlementId TEXT NOT NULL, revision INTEGER NOT NULL,
  expiresAt TEXT NOT NULL, consumed INTEGER NOT NULL DEFAULT 0,
  sessionHash TEXT UNIQUE, sessionExpiresAt TEXT, revoked INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(settlementId,revision) REFERENCES settlement_versions(settlementId,revision)
);
CREATE TABLE settlement_payments (
  id TEXT PRIMARY KEY, settlementId TEXT NOT NULL REFERENCES settlements(id),
  revision INTEGER NOT NULL, amountCents INTEGER NOT NULL CHECK(amountCents > 0),
  returnedCents INTEGER NOT NULL DEFAULT 0 CHECK(returnedCents >= 0 AND returnedCents <= amountCents),
  status TEXT NOT NULL CHECK(status IN ('reserved','processing','confirmed','failed')),
  reference TEXT UNIQUE, evidence TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL,
  actor TEXT NOT NULL
);
CREATE TABLE settlement_audit (
  id TEXT PRIMARY KEY, settlementId TEXT NOT NULL REFERENCES settlements(id),
  event TEXT NOT NULL, actor TEXT NOT NULL, createdAt TEXT NOT NULL
);
CREATE INDEX settlement_invite_session ON settlement_invites(sessionHash);
CREATE INDEX settlement_payment_parent ON settlement_payments(settlementId);

CREATE TRIGGER settlement_versions_immutable BEFORE UPDATE ON settlement_versions BEGIN SELECT RAISE(ABORT,'Agreement versions are immutable'); END;
CREATE TRIGGER settlement_versions_no_delete BEFORE DELETE ON settlement_versions BEGIN SELECT RAISE(ABORT,'Retain agreement versions'); END;
CREATE TRIGGER settlement_signatures_immutable BEFORE UPDATE ON settlement_signatures BEGIN SELECT RAISE(ABORT,'Signed records are immutable'); END;
CREATE TRIGGER settlement_signatures_no_delete BEFORE DELETE ON settlement_signatures BEGIN SELECT RAISE(ABORT,'Retain signed records'); END;
CREATE TRIGGER settlement_audit_immutable BEFORE UPDATE ON settlement_audit BEGIN SELECT RAISE(ABORT,'Audit is append only'); END;
CREATE TRIGGER settlement_audit_no_delete BEFORE DELETE ON settlement_audit BEGIN SELECT RAISE(ABORT,'Audit is append only'); END;
CREATE TRIGGER settlement_signature_current BEFORE INSERT ON settlement_signatures BEGIN
  SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM settlements WHERE id=NEW.settlementId AND revision=NEW.revision AND issue IS NULL)
    THEN RAISE(ABORT,'Agreement changed or needs review') END;
END;
CREATE TRIGGER settlement_reserve_gate BEFORE INSERT ON settlement_payments BEGIN
  SELECT CASE WHEN NEW.status <> 'reserved' OR NEW.returnedCents <> 0 OR NOT EXISTS (
    SELECT 1 FROM settlements s JOIN settlement_versions v ON v.settlementId=s.id AND v.revision=s.revision
    JOIN settlement_signatures sig ON sig.settlementId=s.id AND sig.revision=s.revision
    WHERE s.id=NEW.settlementId AND s.revision=NEW.revision AND s.fundsCleared=1
      AND s.recipientVerified=1 AND s.approved=1 AND s.issue IS NULL
      AND s.destinationRef IS NOT NULL AND length(s.destinationLast4)=4
      AND NEW.amountCents + COALESCE((SELECT SUM(CASE WHEN p.status IN ('reserved','processing') THEN p.amountCents WHEN p.status='confirmed' THEN p.amountCents-p.returnedCents ELSE 0 END) FROM settlement_payments p WHERE p.settlementId=s.id),0) <= v.entitlementCents
  ) THEN RAISE(ABORT,'Payment gate blocked or balance already reserved') END;
END;
CREATE TRIGGER settlement_payment_transition BEFORE UPDATE ON settlement_payments BEGIN
  SELECT CASE WHEN NEW.id<>OLD.id OR NEW.settlementId<>OLD.settlementId OR NEW.revision<>OLD.revision OR NEW.amountCents<>OLD.amountCents
    OR NEW.createdAt<>OLD.createdAt OR NEW.returnedCents<OLD.returnedCents
    OR (OLD.status='failed')
    OR (OLD.status='confirmed' AND NEW.status<>'confirmed')
    OR (OLD.status='processing' AND NEW.status NOT IN ('processing','confirmed','failed'))
    OR (OLD.status='reserved' AND NEW.status NOT IN ('processing','failed'))
    OR (NEW.status IN ('processing','confirmed') AND (NEW.reference IS NULL OR length(NEW.reference)<3 OR NEW.evidence IS NULL OR length(NEW.evidence)<3))
    OR (OLD.reference IS NOT NULL AND NEW.reference IS NOT OLD.reference)
    OR (NEW.returnedCents>0 AND NEW.status<>'confirmed')
    THEN RAISE(ABORT,'Invalid payment transition') END;
END;
CREATE TRIGGER settlement_payments_no_delete BEFORE DELETE ON settlement_payments BEGIN SELECT RAISE(ABORT,'Retain payment ledger'); END;
CREATE TRIGGER settlement_revision_payment_lock BEFORE UPDATE OF revision ON settlements BEGIN
  SELECT CASE WHEN EXISTS(SELECT 1 FROM settlement_payments WHERE settlementId=OLD.id AND status<>'failed')
    THEN RAISE(ABORT,'Reconcile existing payments before amendment') END;
END;
CREATE TRIGGER settlement_destination_lock BEFORE UPDATE ON settlements WHEN OLD.recipientVerified=1 AND NEW.revision=OLD.revision BEGIN
  SELECT CASE WHEN NEW.destinationRef IS NOT OLD.destinationRef OR NEW.destinationLast4 IS NOT OLD.destinationLast4
    THEN RAISE(ABORT,'Verified destination cannot be silently replaced') END;
END;
