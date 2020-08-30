import React from 'react';
import PropTypes from 'prop-types';
import styles from './layout_header.module.css';
import Sidemenu from '../../layout_sidemenu/layout_sidemenu';

const layout_header = () => (
  <div>
    <div className={styles.head_title}>
     <img className={styles.logo} src={process.env.PUBLIC_URL+"/assets/loginLogo.png"}></img>
      <h4>Sign In to K-XII Admin</h4>
    </div>
      <Sidemenu></Sidemenu>
  </div>
);

layout_header.propTypes = {};

layout_header.defaultProps = {};

export default layout_header;
