import type { Metadata } from "next";

import { AdminEditor } from "@/components/site/admin-editor";
import { getCatalog } from "@/lib/data";

export const metadata: Metadata = {
  title: "Panel de productos",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const { products, live } = await getCatalog();
  return <AdminEditor products={products} live={live} />;
}
