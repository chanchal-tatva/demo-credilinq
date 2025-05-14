import { fileUploadConditions } from '@/constants/constants';
import DoneIcon from '@mui/icons-material/Done';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

const FileUploadChecklist = () => {
  return (
    <List>
      {fileUploadConditions.map((item, index) => {
        return (
          <ListItem alignItems="flex-start" key={index}>
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <DoneIcon />
            </ListItemIcon>
            <ListItemText sx={{ opacity: 0.6, color: 'initial' }} primary={item} />
          </ListItem>
        );
      })}
    </List>
  );
};

export default FileUploadChecklist;
