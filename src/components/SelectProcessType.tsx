import { Box } from "@mui/system"
import { SideListItem } from "./SideListItem"
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, LinearProgress } from "@mui/material";
import { useHistory } from 'react-router-dom';
import { useCallback, useEffect, useState } from "react";
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import api from "../api.json";
import Notification from "./Notification";


const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));


export const SelectProcessType = () => {
    const history = useHistory();

    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const getAllProcessType = useCallback(async () => {
        try {
            const options = {
                method: 'GET'
            };
            const response = await fetch(api.ProcessType.getAll, options);
            const data = await response.json();
            setData(data);
            setLoading(false);
        } catch (error: any) {
            setError(error);
            setLoading(false);
        }
    }, [data])

    const selectProcessType = useCallback(async (processTypeId: number) => {
        try {
            const options = {
                method: 'GET',
            };
            const response = await fetch(api.Bpm.iniciar + processTypeId, options);
            const data = await response.json();
            history.push("/process/"+ data.id);
            setLoading(false);
        } catch (error: any) {
            setError(error);
            setLoading(false);
        }
    }, [data])


    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        getAllProcessType();
    }, [])

    useEffect(() => {
        console.log('dataProcessType', data)
    }, [data])

    return (
        <div>
            <Button
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
            >
                Iniciar Processo
            </Button>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {data ? data.map((item) => (
                    <MenuItem onClick={ () => {selectProcessType(item.id)}} disableRipple>
                        {item.name}
                    </MenuItem>
                )) : null}
            </StyledMenu>
        </div>
    );
} 