import { Metadata } from 'next';
import { getAllUsers, deleteUser } from '@/lib/actions/user.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatId } from '@/lib/utils';
import Pagination from '@/components/shared/pagination';
import { Badge } from '@/components/ui/badge';
import DeleteDialog from '@/components/shared/delete-dialog';

export const metadata: Metadata = {
    title: 'Admin User Page',
    description: 'Admin User Page',
}



const AdminUserPage = async (props: {
    searchParams: Promise<{
        page: string
    }>
}) => {
    const {page = '1'} = await props.searchParams;
    const users = await getAllUsers({
        page: Number(page),
    })
    console.log(users);
    return (
        <div className="space-y-2">
      <h2 className="font-bold">Users</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === 'user' ? (<Badge variant='secondary'>User</Badge>): (
                    <Badge variant='default'>Admin</Badge>
                  )}
                </TableCell>
                
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/user/${user.id}`}>
                      Edit
                    </Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser} />
                  {/* create delete action */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={users?.totalPages} />
        )}
      </div>
    </div>
    );
}
 
export default AdminUserPage;