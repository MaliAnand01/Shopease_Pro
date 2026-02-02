import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image }) => {
  const siteTitle = "ShopEase - Modern Minimalist Commerce";
  const defaultDesc = "Curated collection of premium minimalist artifacts for the modern lifestyle.";

  return (
    <Helmet>
      <title>{title ? `${title} | ShopEase` : siteTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title ? `${title} | ShopEase` : siteTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? `${title} | ShopEase` : siteTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO;
