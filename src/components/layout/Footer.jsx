import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-brand-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-brand-orange">
                P-ELLA
              </span>
              <span className="text-2xl font-bold text-brand-plum">Market</span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm">
              Fresh Groceries, Delivered with Love. Discover the finest African
              foods, fresh produce, and pantry staples delivered to your door.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-brand-orange transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-brand-orange transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  className="hover:text-brand-orange transition-colors"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Lagos, Nigeria</li>
              {/* <li>hello@pellamarket.com</li> */}
              <li>Amaka Nwokedike</li>
              <li>+234 803 402 8115</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} P-ELLA Market. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
