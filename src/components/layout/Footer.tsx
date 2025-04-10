
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-lg font-semibold text-primary mb-4">Feed the Future</h2>
            <p className="text-sm text-gray-600">
              Connecting food donors with organizations that help those in need.
              Together we can reduce food waste and fight hunger.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-500 hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="text-sm text-gray-600 hover:text-primary">Home</Link></li>
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-primary">About Us</Link></li>
              <li><Link to="/ngos" className="text-sm text-gray-600 hover:text-primary">NGO Directory</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Get Involved</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/register" className="text-sm text-gray-600 hover:text-primary">Register</Link></li>
              <li><Link to="/login" className="text-sm text-gray-600 hover:text-primary">Login</Link></li>
              <li><Link to="/donate" className="text-sm text-gray-600 hover:text-primary">Make a Donation</Link></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary">Volunteer</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Contact Us</h3>
            <address className="mt-4 text-sm text-gray-600 not-italic">
              <p>123 Charity Street</p>
              <p>Anytown, State 12345</p>
              <p className="mt-2">info@feedthefuture.org</p>
              <p>(123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">&copy; {new Date().getFullYear()} Feed the Future. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
