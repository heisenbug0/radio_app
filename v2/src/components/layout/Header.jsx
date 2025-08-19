"use client";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import CustomLink from "../context/CustomLink";
import MobileMenu from "./MobileMenu";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { BiMapPin } from "react-icons/bi";
import { useTranslation } from "../context/TranslationContext";
import { setActiveLanguage, setCurrentLanguage, setIsFetched, setIsLanguageLoaded } from "@/redux/slices/languageSlice";
import { getLanguageData } from "@/api/apiRoutes";
import { useAuthStatus } from "@/hooks/useAuthStatus";

const SCROLL_THRESHOLD = 50;

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslation();

  const webSettings = useSelector((state) => state.WebSetting?.data);
  const languages = useSelector((state) => state.LanguageSettings?.languages);
  const activeLanguage = useSelector((state) => state.LanguageSettings?.active_language);
  const isLanguageLoaded = useSelector((state) => state.LanguageSettings?.isLanguageLoaded);
  const userSelectedLocation = useSelector((state) => state.location);
  const isUserLoggedIn = useAuthStatus();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);

  useEffect(() => {
    setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const companyEmail = webSettings?.company_email || "iloverealestates@gmail.com";
  const phonePrimary = webSettings?.company_tel1 || "+1 840 600 1116";
  const phoneSecondary = webSettings?.company_tel2 || "";
  const logoSrc = webSettings?.web_logo || "/android-chrome-192x192.png";

  const locationLabel = useMemo(() => {
    const parts = [userSelectedLocation?.city, userSelectedLocation?.state, userSelectedLocation?.country].filter(Boolean);
    return parts.length ? parts.join(", ") : t("selectLocation");
  }, [userSelectedLocation, t]);

  const toggleMenu = () => setIsMenuOpen((p) => !p);

  const menus = useMemo(() => ([
    { name: "properties", links: [
      { href: "/properties", label: t("properties") },
      { href: "/properties/featured-properties", label: t("featuredProperties") },
      { href: "/properties-on-map", label: t("propertiesOnMap") },
    ]},
    { name: "projects", links: [
      { href: "/projects", label: t("projects") },
      { href: "/projects/featured-projects", label: t("featuredProjects") },
    ]},
    { name: "articles", links: [
      { href: "/all/articles", label: t("articles") },
    ]},
  ]), [t]);

  const handleLanguageChange = async (code) => {
    try {
      const response = await getLanguageData({ language_code: code, web_language_file: 1 });
      dispatch(setActiveLanguage({ data: code }));
      dispatch(setCurrentLanguage({ data: response.data }));
      dispatch(setIsFetched({ data: true }));
      dispatch(setIsLanguageLoaded({ data: true }));
      router.replace({ pathname: router.pathname, query: { ...router.query, locale: code } }, undefined, { shallow: true });
    } catch (e) {
      console.error(e);
    }
  };

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
              <div className="hidden items-center gap-2 md:flex">
                <div className="rounded bg-[#0000001A] p-2">
                  <BiMapPin size={24} />
                </div>
                <div className="text-sm text-gray-700">
                  {locationLabel}
                </div>
              </div>
            </div>

            <MobileMenu
              isScrolled={isScrolled}
              isMenuOpen={isMenuOpen}
              toggleMenu={toggleMenu}
              languages={languages}
              menus={menus}
              handleLanguageChange={handleLanguageChange}
              handleShowLogin={() => {}}
              handleLogout={() => {}}
              handleShowAreaConverter={() => {}}
            />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;

