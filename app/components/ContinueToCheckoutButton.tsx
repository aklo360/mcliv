"use client";

import {useMemo, useState} from 'react';
import {QuantitySelector} from '~/components/QuantitySelector';

type Props = {
  variantId: string;
  quantity?: number;
};

function variantGidToNumeric(id: string) {
  const parts = id.split('/');
  return parts[parts.length - 1] || id;
}

export function ContinueToCheckoutButton({variantId, quantity = 1}: Props) {
  const [qty, setQty] = useState(quantity);
  const numericId = useMemo(() => variantGidToNumeric(variantId), [variantId]);
  const checkoutHref = `/cart/${numericId}:${qty}`;

  return (
    <>
      <QuantitySelector defaultValue={quantity} onChange={setQty} />
      <a className="order-link" href={checkoutHref}>
        Order now →
      </a>
    </>
  );
}
