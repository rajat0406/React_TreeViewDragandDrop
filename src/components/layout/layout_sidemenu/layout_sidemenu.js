import React from 'react';
import SideMenu, {Item} from 'react-sidemenu';
import { Link } from 'react-router-dom';
import  styles from './layout_sidemenu.module.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import create_board from '../../manage_board/create_board/create_board';

const layout_sidemenu = () => (
  <div className={styles.sidemenu}>
    {/* <SideMenu theme='custom'>
	        <Item label="Board Management" value="boardmanagement" icon="fa-search">
	          <Item label="Create Board" value="createboard" icon="fa-snapchat">
	          </Item>
	        </Item>
	  </SideMenu> */}
	  <Link className={styles.element} to="/manageboard/createboard">
		  <button className={styles.button}>Board Management</button>
	  </Link>
  </div>
);

layout_sidemenu.propTypes = {};

layout_sidemenu.defaultProps = {};

export default layout_sidemenu;
