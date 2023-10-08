import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import swal from "sweetalert";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  textField: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    width: '100%',
  },
  generatedImage: {
    maxWidth: '100%',
  },
}));

async function registerImage(formData, prompt, props) {
  formData.append('prompt', prompt);
  formData.append('props', JSON.stringify(props));

  console.log(formData);

  return fetch(`${process.env.REACT_APP_BASE_URL}/images`, {
    method: 'POST',
    headers: {
      'Authorization': sessionStorage.getItem("token")
    },
    body: formData
  });
}

export default function Home(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('api_key') || '');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Store the API key in local storage
    localStorage.setItem('api_key', apiKey);

    // Define the API request data
    const url = "https://api.segmind.com/v1/sd1.5-rcnz";
    const data = {
      "prompt": prompt,
      "negative_prompt": "beard, EasyNegative, lowres, chromatic aberration, depth of field, motion blur, blurry, bokeh, bad quality, worst quality, multiple arms, badhandv4",
      "scheduler": "dpmpp_2m",
      "num_inference_steps": 30,
      "guidance_scale": 7,
      "samples": 1,
      "seed": 53094109118,
      "img_width": 512,
      "img_height": 768,
      "base64": false
    };

    let blob; // Définissez 'blob' en dehors du bloc 'try'
    let imageUrl


    const response = await axios.post(url, data, { headers: { 'x-api-key': apiKey }, responseType: 'blob' });

    if (response.status === 200) {
      // If successful, set the generated image
      blob = new Blob([response.data], { type: 'image/jpeg' });
      imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
    } else {
      console.error('Error:', response.data);
    }

    setIsLoading(false);

    const formData = new FormData();
    formData.append('image', blob, 'image.jpg'); // 'image' is the field name for your blob

    // Pass 'formData' directly to 'registerImage'
    await registerImage(formData, prompt, props);
  };


  return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              MonSiteEstGénial
            </Typography>
            <div>
              <IconButton onClick={handleMenu} color="inherit">
                Ici
              </IconButton>
              <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm" className={classes.formContainer}>
          <Typography variant="h5" gutterBottom>
            Configuration
          </Typography>
          {isLoading ? (
              <div className={classes.loader}>
                <p>Loading...</p>
              </div>
          ) : generatedImage ? (
              <img src={generatedImage} alt="Generated" className={classes.generatedImage} />
          ) : (
              <form className={classes.form} onSubmit={handleGenerate}>
                <TextField
                    className={classes.textField}
                    label="API key"
                    variant="outlined"
                    required
                    fullWidth
                    value={apiKey}
                    id="apiKey"
                    name="apiKey"
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <TextField
                    className={classes.textField}
                    label="Script de Génération"
                    variant="outlined"
                    required
                    fullWidth
                    multiline
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submitButton}
                >
                  Sauvegarder
                </Button>
              </form>
          )}
        </Container>
      </div>
  );
}
