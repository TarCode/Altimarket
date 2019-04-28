import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#fff'
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6,
  },
});

const cards = [1, 2, 3];

function Landing(props) {
  const { classes, history } = props;

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
        <img style={{
            height: 'auto',
            maxWidth: '100px',
            paddingLeft: '20px',
            width: 'auto'
          }} className={classes.icon} src='/img/logo.png'/>
            <img style={{
              height: 'auto',
              maxWidth: '200px',
              width: 'auto'
            }}  className={classes.icon} src='/img/logo2.png'/>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
          <div style={{
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'center',
              justifyItems: 'center',
              alignSelf: 'center',
            }}>
                  <div style={{
                    width: '100%',
                    maxWidth: '700px',
                    height: '70vh'
                  }}>
                    <br/>
                    <div style={{
                      fontSize: '150%'
                    }}>
                      <h1><small>The decentralized<br/></small> 
                        <span style={{
                          textDecoration: 'underline'
                        }}>Classified Ads</span>
                      <small><br/>platform</small></h1>
                      <p>Buy, sell and rent stuff for Ether</p>
                      <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={() => history.push('/main') }
                      >
                          Connect wallet and browse
                      </Button>
                    </div>
                  </div>
            </div>
          </div>
        </div>
        <div className={classNames(classes.layout, classes.cardGrid)}>
          {/* End hero unit */}
          <Grid container spacing={40}>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXaB41nmxl8FlSYM_FJ9MeOziNWe2G8Fw_Wgfjx8ouDsF74ZFlGQ" 
                    title="Ethereum"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Get Started
                    </Typography>
                    <Typography>
                        Get started with crypto by getting rid of unused stuff
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="/img/1.png" 
                    title="Ethereum"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Earn Ethereum
                    </Typography>
                    <Typography>
                      Earn Ethereum by selling or renting stuff
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="/img/2.png" 
                    title="Ethereum"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Spend Ethereum
                    </Typography>
                    <Typography>
                      Spend your Ethereum on stuff people are renting or selling
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
          </Grid>
        </div>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          2019 AltiMarket
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          A decentralized application by <a href="https://blocktame.io" target="_blank">Blocktame</a>
        </Typography>
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}

Landing.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Landing);
