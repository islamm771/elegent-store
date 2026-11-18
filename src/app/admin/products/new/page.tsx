import { AdminShell } from "@/features/admin/AdminShell";
import { emptyProduct, ProductForm } from "@/features/admin/ProductForm";
import { adminPage } from "@/lib/admin-page";

export const metadata = { title: "New product — Admin" };

export default async function NewProductPage() {
  const session = await adminPage("/admin/products/new");
  return <AdminShell user={session.user} active="products" title="New product">
    <ProductForm initial={emptyProduct} editing={false} />
  </AdminShell>;
}
