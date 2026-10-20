"""Rebuild the static PDF font from the existing site font.
Run with: uv run --with 'fonttools[woff]' python scripts/settlements/prepare-font.py
"""
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

font = TTFont('public/fonts/Inter-Variable.woff2')
instantiateVariableFont(font, {axis.axisTag: axis.defaultValue for axis in font['fvar'].axes}, inplace=True)
font.flavor = None
font.save('app/assets/settlement-inter-regular.ttf')
