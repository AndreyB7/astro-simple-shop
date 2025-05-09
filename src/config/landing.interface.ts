export interface LandingPageData {
	meta: Meta;
	headerData: HeaderData;
	heroData: HeroData;
	servicesData: ServicesData;
	adventajesData: AdventajesData;
	brandsData: BrandsData;
	footerData: FooterData;
	video: VideoData;
}

export interface HeaderData {
	logo: string;
	links: Link[];
}

export interface HeroData {
	title: string;
	subTitle: string;
	primaryCta: string;
	highlightedTitle: string;
}

export interface ServicesData {
	title: string;
	services: Service[];
}

export interface VideoData {
	title: string;
	videoId: string;
}

export interface Service {
	title: string;
	icon: string;
	description: string;
}

export interface AdventajesData {
	title: string;
	adventajes: Adventaje[];
}

export interface Adventaje {
	title: string;
	description: string;
	img: string;
	imageAlt: string;
}

export interface FooterData {
	logo: string;
	description: string;
	info: string;
	companyName: string;
	contacts: string;
	links: Link[];
	socials: Social[];
}

export interface Link {
	label: string;
	href: string;
}

export interface Social {
	icon: string;
	href: string;
}

export interface BrandsData {
	title: string;
	image: string;
	description: string;
}

export interface ProductTypesData {
	title: string;
	tiers: Tier[];
}

export interface Tier {
	img: string;
	title: string;
	description: string;
	features: string[];
	links: {
		url: string;
		label: string;
	}[];
}

export interface Price {
	amount: string;
	period?: string;
}

export interface Seo {
	title: string;
	description: string;
	keywords?: string[];
	image?: string,
}

export interface Meta {
	lang: string;
	charset: string;
	ldJson: LdJson;
}

export interface LdJson {
	"@context": string;
	"@type": string;
	name: string;
	description: string;
	image?: string;
	offers?: {
		"@type": string;
		price: number;
		priceCurrency: string;
	};
	url?: string;
	logo?: string;
	contactPoint?: {
		"@type": string;
		email: string;
		contactType: string;
	};
	sameAs?: string[];
}

export type Icon =
	| "DevIcon"
	| "FileIcon"
	| "PlanetIcon"
	| "ConfigIcon"
	| "CheckIcon"
	| "InstagramIcon"
	| "GithubIcon"
	| "TwitterIcon"
	| "FacebookIcon"
	| "ReactIcon"
	| "SvelteIcon"
	| "SolidIcon"
	| "VueIcon"
	| "VercelIcon"
	| "NetlifyIcon"
	| "ArrowRightIcon";
