import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-300 text-black mt-10 p-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

      
        <div>
          <h2 className="footer-title">Quick Links</h2>
          <ul className="space-y-2">
            <li><a className="link link-hover">Home</a></li>
            <li><a className="link link-hover">About</a></li>
            <li><a className="link link-hover">Services</a></li>
            <li><a className="link link-hover">Contact</a></li>
          </ul>
        </div>

      
        <div>
          <h2 className="footer-title">Contact Details</h2>
          <p>📍 Kaliganj, Satkhira, Bangladesh</p>
          <p>📞 +880 1234 567 890</p>
          <p>✉️ support@example.com</p>
        </div>

      
        <div>
          <h2 className="footer-title">Follow Us</h2>
          <div className="flex space-x-4 text-xl mt-2">
            <a className="hover:text-primary"><FaFacebookF /></a>
            <a className="hover:text-primary"><FaXTwitter /></a>
            <a className="hover:text-primary"><FaInstagram /></a>
            <a className="hover:text-primary"><FaLinkedinIn /></a>
          </div>
        </div>

      </div>

     
      <div className="text-center mt-10 border-t pt-5">
        <p>© {new Date().getFullYear()} — All rights reserved | BookCourier Industries Ltd.</p>
      </div>
    </footer>
  );
};

export default Footer;
