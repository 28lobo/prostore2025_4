import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.actions';

export const metadata: Metadata = {
    title: 'Update User',
    description: 'Update user details',
};

const AdminUsersUpdatePage = async(props: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await props.params;
    const user = await getUserById(id);
    if(!user) notFound();
    
    return ( <div className="space-y-8 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">Update User</h1>

    </div> );
}
 
export default AdminUsersUpdatePage;