
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import Button from './ui/Button';
import Input from './ui/Input';
import Label from './ui/Label';
import PasswordInput from './PasswordInput';
import { Role } from '../types';
import Select from './ui/Select';

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  role: Role;
  organizerStatus?: 'pending' | 'approved';
}

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUp: (formData: SignUpFormData) => boolean;
  onLogin: () => void;
}

const SignUpDialog: React.FC<SignUpDialogProps> = ({ open, onOpenChange, onSignUp, onLogin }) => {
  const [formData, setFormData] = useState<Omit<SignUpFormData, 'organizerStatus'>>({ name: '', email: '', password: '', role: Role.USER });
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData: SignUpFormData = { ...formData };
    if (submissionData.role === Role.ORGANIZER) {
        submissionData.organizerStatus = 'pending';
    }
    const success = onSignUp(submissionData);
    if (!success) {
      setError('An account with this email already exists.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create an Account</DialogTitle>
          <DialogDescription>Join EventEase to discover and create amazing events.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">I am a...</Label>
            <Select id="role" name="role" value={formData.role} onChange={handleChange}>
                <option value={Role.USER}>User (I want to attend events)</option>
                <option value={Role.ORGANIZER}>Organizer (I want to create events)</option>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter className="flex-col space-y-2 sm:flex-col sm:space-y-2 sm:space-x-0">
            <Button type="submit" className="w-full">Create Account</Button>
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button type="button" onClick={onLogin} className="text-primary hover:underline font-medium">Login</button>
            </p>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;