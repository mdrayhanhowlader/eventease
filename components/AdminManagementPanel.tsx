import React from 'react';
import { User, Role } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import Button from './ui/Button';

interface AdminManagementPanelProps {
  users: User[];
  onApprove: (userId: string) => void;
  onDeny: (userId: string) => void;
}

const AdminManagementPanel: React.FC<AdminManagementPanelProps> = ({ users, onApprove, onDeny }) => {
  const pendingOrganizers = users.filter(user => user.role === Role.ORGANIZER && user.organizerStatus === 'pending');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Management</CardTitle>
        <CardDescription>Review pending requests from users who want to become event organizers.</CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">Pending Organizer Requests</h3>
        {pendingOrganizers.length > 0 ? (
          <div className="space-y-4">
            {pendingOrganizers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-secondary/50">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onApprove(user.id)}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => onDeny(user.id)}>Deny</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">No pending organizer requests at this time.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminManagementPanel;
