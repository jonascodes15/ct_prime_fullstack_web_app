import { Link } from 'react-router-dom';
import './Footer.css';

const COLS = [
  {
    heading: 'MARKETS',
    links: [
      { label: 'Forex', to: '/markets#forex' },
      { label: 'Cryptos', to: '/markets#crypto' },
      { label: 'Stocks', to: '/markets#stocks' },
      { label: 'Indices', to: '/markets#indices' },
    ],
  },
  {
    heading: 'TRADING',
    links: [
      { label: 'Platform', to: '/register' },
      { label: 'Pricing', to: '/#pricing' },
      { label: 'PAMM', to: '/register' },
      { label: 'Help Centre/FAQ', to: '/about#contact' },
    ],
  },
  {
    heading: 'COMPANY',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Why Us', to: '/about#why' },
      { label: 'Contact Us', to: '/about#contact' },
    ],
  },
  {
    heading: 'ACCOUNT',
    links: [
      { label: 'Login', to: '/login' },
      { label: 'Sign Up', to: '/register' },
    ],
  },
  {
    heading: 'LEGAL',
    links: [
      { label: 'Privacy Policy', to: '#' },
      { label: 'Terms of Service', to: '#' },
      { label: 'Trade Certificate', to: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      {/* Main nav columns */}
      <div className="footer-nav">
        <div className="footer-nav-inner">
          {COLS.map((col) => (
            <div key={col.heading} className="footer-col">
              <h5>{col.heading}</h5>
              {col.links.map((l) => (
                <Link key={l.label} to={l.to}>{l.label}</Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="footer-divider" />

      {/* Legal text */}
      <div className="footer-legal">
        <div className="footer-legal-inner">
          <p>This website can be accessed worldwide however the information on the website is related to CopyTradePrime A/S and is not specific to any entity of CopyTradePrime. All clients will directly engage with CopyTradePrime A/S and all client agreements will be entered into with CopyTradePrime A/S.</p>
          <p>Forex and CFDs are leveraged products and can result in losses that exceed your deposits. Please ensure you fully understand all of the risks. Contracts for Difference ("CFDs") are leveraged products and carry a significant risk of loss to your capital, as prices may move rapidly against you and you may be required to make further payments to keep any trades open. These products are not suitable for all clients, therefore please ensure you fully understand the risks and seek independent advice.</p>
          <p>Apple and the Apple logo are trademarks of Apple Inc, registered in the US and other countries and regions. App Store is a service mark of Apple Inc. Google Play and the Google Play logo are trademarks of Google LLC.</p>
          <p className="footer-copy">Copyright © 2014 – {new Date().getFullYear()} All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
