import React from 'react';
import {
  FaFacebookF, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope
} from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral text-neutral-content py-10 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold">VolunteerHub</h2>
          <p className="opacity-80 mt-2">Empowering communities since {year}</p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="hover:text-primary"><FaFacebookF /></a>
            <a href="#" className="hover:text-primary"><FaTwitter /></a>
            <a href="#" className="hover:text-primary"><FaInstagram /></a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 opacity-80">
            <li><a href="#" className="hover:text-primary">About</a></li>
            <li><a href="#" className="hover:text-primary">Support</a></li>
            <li><a href="#" className="hover:text-primary">Terms</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="flex items-center gap-2 opacity-80"><FaPhoneAlt /> +1 (555) 123-4567</p>
          <p className="flex items-center gap-2 opacity-80"><FaEnvelope /> contact@volunteerhub.com</p>
        </div>
      </div>

      <div className="border-t border-neutral-content/20 mt-8 pt-4 text-center text-xs opacity-70">
        &copy; {year} VolunteerHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
