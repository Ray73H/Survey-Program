import React, { useState } from 'react';
import { AppBar, Toolbar, Tabs, Tab, Box, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GroupIcon from '@mui/icons-material/Group';

export default function SuperUserNavbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar
        disableGutters
        sx={{
          paddingLeft: '110px',
          minHeight: '48px !important',
          height: '48px',
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Tabs
            value={false}
            textColor="primary"
            indicatorColor="primary"
            sx={{ minHeight: '48px', height: '48px' }}
          >
            <Tab
              label="Admin Overview"
              icon={<HomeIcon />}
              iconPosition="start"
              onClick={() => navigate('/superuser/admin_overview')}
              sx={{ minHeight: '48px', height: '48px' }}
            />

            <Tab
              label="Survey List"
              icon={<FormatListBulletedIcon />}
              iconPosition="start"
              onClick={() => navigate('/superuser/survey_list')}
              sx={{ minHeight: '48px', height: '48px' }}
            />

            <Tab
              label="Account Manager"
              icon={<GroupIcon />}
              iconPosition="start"
              onClick={() => navigate('/superuser/account_manager')}
              sx={{ minHeight: '48px', height: '48px' }}
            />
          </Tabs>
        </Box>

    
      </Toolbar>
    </AppBar>
  );
}
