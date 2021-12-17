import { Button, Card, CardContent, Avatar, CardActions } from '@mui/material';
import React from 'react';
import { useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import { DropdownMenu } from '..';

const cookies = new Cookies();

const MyProfile = () => {
    const { client } = useChatContext();

    const logout = () => {
        cookies.remove('token');
        cookies.remove('userId');
        cookies.remove('userName');
        cookies.remove('fullName');
        cookies.remove('avatarUrl');
        cookies.remove('hashedPassword');
        cookies.remove('phoneNumber');

        window.location.reload();
    };

    return (
        <div className="my-profile__container w-screen p-4">
            <div className="flex justify-between items-center">
                <p className="text-white font-semibold text-lg">My Profile</p>
                <Button
                    variant="contained"
                    color="error"
                    size="medium"
                    onClick={logout}
                    aria-label="delete"
                >
                    <p className="text-xs">Logout</p>
                </Button>
            </div>
            <Card className="mt-40">
                <CardContent>
                    <span className="flex justify-end">
                        <DropdownMenu
                            menuItems={['Deactivate Account', 'Delete Account']}
                        />
                    </span>
                    <div className="flex justify-center">
                        <div>
                            <Avatar
                                sx={{ width: 86, height: 86 }}
                                src={client.user.image}
                                className="mx-auto"
                            />
                            <div className="text-center">
                                <p className="text-3xl font-semibold mt-3">
                                    {client.user.fullName}
                                </p>
                                <p className="text-lg text-gray-400">
                                    {client.user.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardActions>
                    <Button variant="contained" fullWidth>
                        Edit Profile
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
};

export default MyProfile;
