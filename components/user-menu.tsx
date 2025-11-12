'use client';

import { useState, useEffect } from 'react';
import { usePrivy, type User } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export function UserMenu() {
    const { user, logout, authenticated } = usePrivy();
    // Type assertion to include the google property
    type UserWithGoogle = User & {
        google?: {
            picture?: string;
        };
    };
    const typedUser = user as UserWithGoogle;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set loading to false after component mounts
        setIsLoading(false);
    }, []);

    if (isLoading || !authenticated || !user) {
        return (
            <Button variant="ghost" size="icon" disabled>
                <Icons.spinner className="h-4 w-4 animate-spin" />
            </Button>
        );
    }

    const userInitial = user.email?.address?.[0]?.toUpperCase() || 'U';
    const userEmail = user.email?.address || 'user@example.com';
    const userName = user.email?.address?.split('@')[0] || 'User';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                    aria-label="User menu"
                >
                    <Avatar className="h-8 w-8">
                        {typedUser.google?.picture ? (
                            <AvatarImage src={typedUser.google.picture} alt={userName} />
                        ) : (
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {userInitial}
                            </AvatarFallback>
                        )}
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {userEmail}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <Icons.user className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        logout();
                        router.push('/login');
                    }}
                    className="text-destructive focus:text-destructive"
                >
                    <Icons.logOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
