import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectIsInApp, getSelectUrl } from 'app/services/environment/selectors';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';
import { resetButton } from 'app/styles/customProperties';
import { sendPostRobotOpenBrowser } from 'app/utils/inAppMessageEvents';
import { isRidiselectUrl } from 'app/utils/regexHelper';
import { useViewportIntersection } from 'hooks/useViewportIntersection';

const BannerImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: 0 0;
`;

interface CarouselItemContainerProps {
  imageWidth: number;
  imageHeight: number;
  active?: boolean;
  invisible?: boolean;
}

const CarouselItemContainer = styled.li<CarouselItemContainerProps>`
  flex: none;
  position: relative;
  width: ${props => props.imageWidth}px;
  height: ${props => props.imageHeight}px;

  overflow: hidden;
  line-height: 0;
  transition: width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s;
  opacity: ${props => (props.invisible ? 0 : 1)};

  &:focus-within {
    box-shadow: 0 0.8px 3px rgba(0, 0, 0, 0.33);
  }

  & ::before {
    display: block;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    transition: background-color 0.2s;
    background-color: rgba(26, 26, 26, ${props => (props.active ? 0 : 0.5)});

    pointer-events: none;
  }
`;

const BannerImageLinkStyle = css`
  width: 100%;
  height: 100%;

  display: inline-block;
  outline: none;
`;

const BannerImageAnchor = styled.a`
  ${BannerImageLinkStyle}
`;

const BannerImageButton = styled.button`
  ${resetButton}
  ${BannerImageLinkStyle}
`;

export interface TopBanner {
  landing_url: string;
  title: string;
  main_image_url: string;
  id: number;
}

interface CarouselItemProps {
  index: number;
  itemWidth: number;
  banner: TopBanner;
  active: boolean;
  invisible: boolean;
  section: string;
}

interface BannerImageLinkProps {
  index: number;
  bannerId: number;
  landingUrl: string;
  tabIndex: number;
  section: string;
}

const BannerImageLink: React.FunctionComponent<BannerImageLinkProps> = props => {
  const { index, bannerId, landingUrl, tabIndex, children, section } = props;
  const dispatch = useDispatch();
  const isInApp = useSelector(selectIsInApp);
  const SELECT_URL = useSelector(getSelectUrl);

  const handleLinkClick = () => {
    const trackingParams: DefaultTrackingParams = {
      section,
      index,
      id: bannerId,
    };
    dispatch(TrackingActions.trackClick({ trackingParams }));
  };

  if (isRidiselectUrl(landingUrl)) {
    return (
      <Link
        css={BannerImageLinkStyle}
        to={landingUrl.replace(SELECT_URL, '')}
        tabIndex={tabIndex}
        onClick={handleLinkClick}
      >
        {children}
      </Link>
    );
  }

  if (isInApp) {
    return (
      <BannerImageButton
        tabIndex={tabIndex}
        onClick={() => {
          sendPostRobotOpenBrowser(landingUrl);
          handleLinkClick();
        }}
      >
        {children}
      </BannerImageButton>
    );
  }

  return (
    <BannerImageAnchor href={landingUrl} tabIndex={tabIndex} onClick={handleLinkClick}>
      {children}
    </BannerImageAnchor>
  );
};

const BannerWidthSection = [320, 360, 375, 414, 450];
const BannerWidthSet = [450, 720, 760, 828, 900];

export default function CarouselItem(props: CarouselItemProps) {
  const { itemWidth, banner, active, invisible, index, section } = props;
  const [intersecting, setIntersecting] = React.useState(false);
  const ref = useViewportIntersection<HTMLLIElement>(setIntersecting);
  const [imageSrcSet, setImageSrcSet] = React.useState({
    src: '',
    sizes: '',
    srcSet: '',
  });

  const { main_image_url: imageUrl } = banner;
  React.useEffect(() => {
    const maxWidth = BannerWidthSection.find(sectionWidth => sectionWidth >= itemWidth);
    const src = `${imageUrl}?w=${maxWidth}`;
    const sizes = `${itemWidth}px`;
    const srcSet = BannerWidthSet.map(
      (bannerWidth: number) => `${imageUrl}?w=${bannerWidth} ${bannerWidth}w`,
    ).join(',');
    setImageSrcSet({
      src,
      sizes,
      srcSet,
    });
  }, [itemWidth]);

  return (
    <CarouselItemContainer
      ref={ref}
      imageWidth={itemWidth}
      imageHeight={itemWidth}
      active={active}
      invisible={invisible}
    >
      <BannerImageLink
        index={index}
        bannerId={banner.id}
        landingUrl={banner.landing_url}
        tabIndex={active ? 0 : -1}
        section={section}
      >
        {(!invisible || intersecting) && <BannerImage alt={banner.title} {...imageSrcSet} />}
      </BannerImageLink>
    </CarouselItemContainer>
  );
}
