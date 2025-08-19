"use client";
import { useSelector } from "react-redux";
import Link from "next/link";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import CustomLink from "../context/CustomLink";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";

const Header = () => {
  const webSettings = useSelector((state) => state.WebSetting?.data);

  const companyEmail = webSettings?.company_email || "iloverealestates@gmail.com";
  const phonePrimary = webSettings?.company_tel1 || "+1 840 600 1116";
  const phoneSecondary = webSettings?.company_tel2 || "";
  const logoSrc = webSettings?.web_logo || "/android-chrome-192x192.png";

  return (
    <div className="w-full">
      <div className="primaryBg hidden py-2 text-white md:block">
        <div className="container flex items-center justify-between px-3 md:px-0">
          <div className="flex items-center gap-4">
            <Link href={`mailto:${companyEmail}`} className="flex items-center gap-2 text-sm">
              <MdEmail className="rounded-full bg-[#FFFFFF3D] p-1 text-white" size={26} />
              {companyEmail}
            </Link>
            <Link href={`tel:${phonePrimary}`} className="flex items-center gap-2 text-sm">
              <FaPhone className="rounded-full bg-[#FFFFFF3D] p-1 text-white" size={26} />
              {phonePrimary}
            </Link>
            {phoneSecondary && (
              <Link href={`tel:${phoneSecondary}`} className="flex items-center gap-2 text-sm">
                <FaPhone className="rounded-full bg-[#FFFFFF3D] p-1 text-white" size={26} />
                {phoneSecondary}
              </Link>
            )}
          </div>
        </div>
      </div>

      <header className="relative z-10 w-full bg-white">
        <div className="container px-2 md:px-0">
          <div className="my-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <CustomLink href={`/`} title="Home">
                <div className="h-14 w-44">
                  <ImageWithPlaceholder src={logoSrc} alt="logo" height={0} width={0} className="h-full w-full" />
                </div>
              </CustomLink>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;

