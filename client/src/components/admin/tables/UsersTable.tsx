import { Fragment } from 'react'
import { Button } from '@/components/ui/button'
import ModalDescription from '@/components/modals/ModalDescription'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type PropsTypes = {
    users: any[]
}

const UsersTable = ({users}: PropsTypes) => {
    return (
        <Fragment>
            <Table>
                <TableCaption>A list about users data.</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Photo</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Orders History</TableHead>
                    <TableHead>Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length > 0 ? users.map((user, index) => (
                        <TableRow key={user._id} className='text-[15px]'>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>
                                <img src={user.photo.photo_url ? user.photo.photo_url : `https://ui-avatars.com/api?format=svg&bold=true&name=${user?.username.slice(0, 2)}`} alt={user.username} className='h-[30px] object-contain rounded-full'/>
                            </TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.orders_history.length}</TableCell>
                            <TableCell>
                                <ModalDescription title='User Description' triggerComponent={<Button variant='outline' size='sm'>Details</Button>}>
                                    <div className='flex space-x-5'>
                                        
                                    </div>
                                </ModalDescription>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell>no data</TableCell>
                            <TableCell>no data</TableCell>
                            <TableCell>no data</TableCell>
                            <TableCell>no data</TableCell>
                            <TableCell>no data</TableCell>
                            <TableCell>no data</TableCell>
                            <TableCell>no data</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Fragment>
    )
}

export default UsersTable