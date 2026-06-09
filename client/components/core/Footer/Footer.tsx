import React from 'react';
import { FaGithub, FaFacebook, FaInstagram } from 'react-icons/fa';

import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>© 2020 Dress Shop. All rights reserved.</p>
        <ul className={styles.links}>
          <li>
            <button type="button" className={styles.socialBtn} aria-label="Facebook">
              <FaFacebook size={22} />
            </button>
          </li>
          <li>
            <button type="button" className={styles.socialBtn} aria-label="Instagram">
              <FaInstagram size={22} />
            </button>
          </li>
          <li>
            <a href="https://github.com/jrussumbrella/dress-shop/" target="_blank" rel="noreferrer">
              <FaGithub size={22} />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
