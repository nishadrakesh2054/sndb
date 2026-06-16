import {
  FaFacebookF,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const contactItems = [
  {
    icon: FaMapMarkerAlt,
    label: "Kathmandu, Nepal",
  },
  {
    icon: FaPhoneAlt,
    label: "+977 9817073670",
    href: "tel:+9779817073670",
  },
  {
    icon: FaEnvelope,
    label: "sndbdoctors@gmail.com",
    href: "mailto:sndbdoctors@gmail.com",
  },
];

const socialLinks = [
  {
    icon: FaFacebookF,
    href: "https://www.facebook.com/share/PxQiCqxYdNR851RL/?mibextid=LQQJ4d",
    label: "Facebook",
    hoverClass: "hover:bg-blue-500 hover:border-blue-400",
  },
  {
    icon: FaWhatsapp,
    href: "https://wa.me/9779817073670",
    label: "WhatsApp",
    hoverClass: "hover:bg-green-500 hover:border-green-400",
  },
  {
    icon: FaEnvelope,
    href: "mailto:sndbdoctors@gmail.com",
    label: "Email",
    hoverClass: "hover:bg-red-500 hover:border-red-400",
  },
];

const Topbar: React.FC = () => {
  return (
    <div className="hidden md:block bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white text-sm border-b border-green-950/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {contactItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon className="h-3 w-3 text-green-200" />
                </span>
                <span className="truncate">{item.label}</span>
              </>
            );

            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                className="group flex items-center gap-2 text-green-50/90 transition-colors hover:text-white"
              >
                {content}
              </a>
            ) : (
              <div
                key={item.label}
                className="flex items-center gap-2 text-green-50/90"
              >
                {content}
              </div>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden lg:inline text-xs font-medium uppercase tracking-wider text-green-200/70">
            Follow us
          </span>
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-200 hover:scale-110 ${social.hoverClass}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
