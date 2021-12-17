import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useWindowDimensions from '../../../hooks/use-window-dimensions';

export default function BasicMenu({ menuItems }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    // eslint-disable-next-line no-unused-vars
    const { width, height } = useWindowDimensions();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                id="basic-button"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuItems.map((menuItem, i) => (
                    <MenuItem key={i} onClick={handleClose}>
                        <p className={width < 768 ? 'text-xs' : ''}>
                            {menuItem}
                        </p>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
