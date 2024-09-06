import { Metadata } from "next";

import { notFound, redirect } from "next/navigation";
import { bufferEqual } from "../../_internal/lib/bufferEqual";
import { canonizeFixed } from "../../_internal/lib/canonizeFixed";
import { getSymmetryGroup } from "../../_internal/lib/getSymmetryGroup";
import { isValid } from "../../_internal/lib/isValid";
import { renderToSvg } from "../../_internal/lib/renderToSvg";
import { toBuffer } from "../../_internal/lib/toBuffer";
import { toString } from "../../_internal/lib/toString";
import { PolyominoPage } from "../../_internal/pages/PolyominoPage";

interface Params {
  params: Record<"anyForm", string>;
}

export default async function Page({ params }: Params) {
  const anyForm = params.anyForm;
  const polyomino = isValid(anyForm);
  if (!polyomino) throw notFound();
  const canonized = toBuffer(canonizeFixed(polyomino));
  if (!bufferEqual(canonized, toBuffer(polyomino)))
    throw redirect(`/${toString(canonized)}`);
  const getSymmetryGroupResult = getSymmetryGroup(polyomino);

  return <PolyominoPage getSymmetryGroupResult={getSymmetryGroupResult} />;
}

export function generateMetadata({ params }: Params): Metadata {
  const anyForm = params.anyForm;
  const polyomino = isValid(anyForm);
  if (!polyomino) throw notFound();
  const canonized = toBuffer(canonizeFixed(polyomino));
  if (!bufferEqual(canonized, toBuffer(polyomino)))
    throw redirect(`/${toString(canonized)}`);
  const [symmetryGroup] = getSymmetryGroup(polyomino);

  const title = `Polyomino ${anyForm}`;
  const svgString = renderToSvg(polyomino, { backgroundColor: "white" });
  const base64Svg = Buffer.from(svgString).toString("base64");
  const imageUrl = `data:image/svg+xml;base64,${base64Svg}`;
  const description = `Polyomino ${anyForm} with symmetry group ${symmetryGroup}`;

  return {
    title,
    description,
    openGraph: {
      title,
      images: imageUrl,
      description,
    },
  };
}
