import { useEffect } from "react";
import { Stack, Box } from "@mui/material";

import AOS from "aos";

import ProductBanner from "./Banners/ProductBanner";
import Banners from "./Banners/Banners";
import Discover from "./Discover/Discover";
import Service from "./Service/Service";
import Products from "./Products/Products";
import Customer from "./Customer/Customer";
import Certi from "./Certi/Certi";

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out",
      offset: 120,
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <Stack px={3} gap={3}>
      <Box>
        <ProductBanner />
      </Box>
      <Box data-aos="fade-up">
        <Products />
      </Box>
      <Banners />
      <Box data-aos="fade-right">
        <Discover />
      </Box>
      <Box data-aos="flip-down">
        <Certi />
      </Box>
      <Box data-aos="zoom-in-down">
        <Service />
      </Box>
      <Box
        data-aos="fade-down"
        data-aos-easing="linear"
        data-aos-duration="1500"
      >
        <Customer />
      </Box>
    </Stack>
  );
};

export default HomePage;
