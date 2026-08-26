/**
 * Footer component for the Gourmet Food F&B storefront template.
 *
 * Provides a restaurant-specific footer layout tailored for food & beverage
 * businesses such as restaurants, cafes, bakeries, and bistros. The component
 * renders a three-column grid on desktop (stacked on mobile) containing:
 *
 * - **Column 1**: Restaurant name, physical address, phone number, and email
 *   contact, each prefixed with an appropriate Lucide icon for quick scanning.
 * - **Column 2**: Opening / business hours, ideal for displaying daily or
 *   weekly schedule information.
 * - **Column 3**: Social media links allowing customers to follow the
 *   restaurant on various platforms.
 *
 * A bottom bar displays a copyright notice with the current year and
 * "All rights reserved" text.
 *
 * The colour scheme uses `text-muted-foreground` and `border-border` tokens
 * to blend naturally with the warm F&B theme palette defined in the
 * gourmet-food template configuration.
 *
 * @module gourmet-food/components/Footer
 */

import { Phone, MapPin, Clock, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Represents a single social media link for the restaurant. */
export interface SocialLink {
  /** Display name of the social platform (e.g. "Facebook", "Instagram"). */
  platform: string;
  /** Full URL to the restaurant's profile on the platform. */
  url: string;
}

/** Props for the {@link Footer} component. */
export interface FooterProps {
  /** The display name of the restaurant or F&B business. */
  restaurantName: string;
  /** Contact phone number (optional). */
  phone?: string;
  /** Physical street address (optional). */
  address?: string;
  /** Opening / business hours description (optional). */
  hours?: string;
  /** Contact email address (optional). */
  email?: string;
  /** List of social media links to display (optional). */
  socialLinks?: SocialLink[];
  /** Additional CSS class names forwarded to the root element (optional). */
  className?: string;
}

/** Current year for the copyright notice. */
const CURRENT_YEAR = new Date().getFullYear();

/**
 * Renders a single contact detail row with an icon, label, and value.
 *
 * @param icon    - The Lucide icon component to render.
 * @param label   - Accessible label describing the contact type.
 * @param value   - The text value to display.
 * @param href    - Optional `href` to wrap the value in an anchor tag.
 */
function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <li className="flex items-start gap-2">
      <Icon
        className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      {href ? (
        <a
          href={href}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {value}
        </a>
      ) : (
        <span className="text-sm text-muted-foreground">{value}</span>
      )}
      <span className="sr-only">{label}: {value}</span>
    </li>
  );
}

/**
 * F&B storefront footer component for the Gourmet Food template.
 *
 * @param props - {@link FooterProps}
 * @returns The rendered footer element.
 */
export function Footer({
  restaurantName,
  phone,
  address,
  hours,
  email,
  socialLinks,
  className,
}: FooterProps) {
  return (
    <footer
      className={`border-t border-border bg-background ${className ?? ""}`}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Three-column grid: stacked on mobile, side-by-side on md+ */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Column 1 - Restaurant info & contact */}
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {restaurantName}
            </h3>
            <ul className="mt-4 space-y-3" aria-label="Contact information">
              {address && (
                <ContactRow
                  icon={MapPin}
                  label="Address"
                  value={address}
                />
              )}
              {phone && (
                <ContactRow
                  icon={Phone}
                  label="Phone"
                  value={phone}
                  href={`tel:${phone}`}
                />
              )}
              {email && (
                <ContactRow
                  icon={Mail}
                  label="Email"
                  value={email}
                  href={`mailto:${email}`}
                />
              )}
            </ul>
          </div>

          {/* Column 2 - Opening hours */}
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Opening Hours
            </h3>
            {hours ? (
              <div className="mt-4 flex items-start gap-2">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {hours}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Hours not available.
              </p>
            )}
          </div>

          {/* Column 3 - Social links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Follow Us
            </h3>
            {socialLinks && socialLinks.length > 0 ? (
              <ul className="mt-4 space-y-2" aria-label="Social media links">
                {socialLinks.map((link) => (
                  <li key={link.platform}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                No social links available.
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar - Copyright */}
        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {CURRENT_YEAR} {restaurantName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
