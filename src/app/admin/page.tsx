import { isAdminAuthedFromRequest } from '@/lib/adminAuth';
import FunAdminLogin from '@/components/admin/FunAdminLogin';
import FunBuildsAdmin from '@/components/admin/FunBuildsAdmin';

export default async function AdminPage() {
  const authed = await isAdminAuthedFromRequest();
  if (!authed) return <FunAdminLogin />;
  return <FunBuildsAdmin />;
}

