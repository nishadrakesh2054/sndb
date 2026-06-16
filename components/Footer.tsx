import Link from "next/link";
import {
  FaChevronRight,
  FaEnvelope,
  FaFacebookF,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

const pageLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "President's Message", to: "/executive-message" },
  { label: "Blogs", to: "/blog" },
  { label: "Notice", to: "/notice" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

const committeeLinks = [
  { label: "Executive Committee", to: "/executive-committee" },
  { label: "Past Executive Committee", to: "/past-committee" },
];

const memberLinks = [
  { label: "Life Members", to: "/member" },
  { label: "Membership Info", to: "/register-member" },
];

const contactInfo = [
  { icon: FaMapMarkerAlt, text: "Kathmandu, Nepal" },
  {
    icon: FaPhoneAlt,
    text: "+977 9817073670",
    href: "tel:+9779817073670",
  },
  {
    icon: FaEnvelope,
    text: "sndbdoctors@gmail.com",
    href: "mailto:sndbdoctors@gmail.com",
  },
];

const socialLinks = [
  {
    icon: FaFacebookF,
    href: "https://www.facebook.com/share/PxQiCqxYdNR851RL/?mibextid=LQQJ4d",
    label: "Facebook",
  },
  {
    icon: FaWhatsapp,
    href: "https://wa.me/9779817073670",
    label: "WhatsApp",
  },
];

const FooterHeading = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3 className={`mb-4 ${className}`}>
    <span className="block text-xs font-semibold uppercase tracking-widest text-green-800">
      {children}
    </span>
    <span
      className="mt-1.5 block h-0.5 w-8 rounded-full bg-red-500"
      aria-hidden="true"
    />
  </h3>
);

const linkClass =
  "inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-green-700";

const FooterActiveLink = ({ href, label }: { href: string; label: string }) => (
  <Link href={href} className={linkClass}>
    <FaChevronRight className="h-3 w-3 shrink-0 text-green-600" />
    {label}
  </Link>
);

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-green-700 bg-emerald-50 text-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-start gap-3">
              <img
                src="/sndblogo1.png"
                alt="SNDB Logo"
                className="h-16 w-16 shrink-0 object-contain"
              />
              <div>
                <p className="text-sm font-bold leading-snug text-gray-900">
                  सोसाइटी फर नेप्लिज डॉक्टर्स फ्रॉम बंगलादेश
                </p>
                <p className="mt-1 text-xs font-medium text-green-700">
                  Society For Nepalese Doctors from Bangladesh
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-600">
              A non-political, non-profit organization uniting Nepalese doctors
              who graduated from Bangladesh and serve communities in Nepal and
              abroad.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-green-200 bg-white text-green-700 transition hover:border-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2">
            <FooterHeading>Pages</FooterHeading>
            <ul className="space-y-2.5">
              {pageLinks.map((item) => (
                <li key={item.to}>
                  <FooterActiveLink href={item.to} label={item.label} />
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <FooterHeading>Committee</FooterHeading>
            <ul className="space-y-2.5">
              {committeeLinks.map((item) => (
                <li key={item.to}>
                  <FooterActiveLink href={item.to} label={item.label} />
                </li>
              ))}
            </ul>

            <FooterHeading className="mt-8">Members</FooterHeading>
            <ul className="space-y-2.5">
              {memberLinks.map((item) => (
                <li key={item.to}>
                  <FooterActiveLink href={item.to} label={item.label} />
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <FooterHeading>Contact Us</FooterHeading>
            <ul className="space-y-4">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                const content = (
                  <span className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-green-700">
                      {item.text}
                    </span>
                  </span>
                );

                return (
                  <li key={item.text}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="block hover:[&_span:last-child]:text-green-700"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-green-100 sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p>
            © {year} Society For Nepalese Doctors from Bangladesh. All rights
            reserved.
          </p>
          <p className="text-green-200">Kathmandu, Nepal</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
