import styled from 'styled-components'
import { FlexCol } from '../../globals'
import { useState } from 'react'

export const Wrapper = styled(FlexCol)`
  .tab-content, .nav.nav-tabs {
      width: 100%;
  }

  .nav-tabs, .nav-link.active {
    border-color: #3C4B64 !important;
  }

  .nav-link.active {
    border-color: #3C4B64 #3C4B64 #ebedef !important;
    color: #2200cc;
  }
`

export const IMG = styled.img`
    width: 100%;
    max-height: 50vh;
`

export const GalleryWrapper = styled(FlexCol)`
    height: auto;
    margin-bottom: 2rem;

    padding: 0.5rem 1rem;

    .image-gallery-content.right .image-gallery-slide .image-gallery-image {
        height: 60vh;
    }

    .image-gallery-content.right.fullscreen .image-gallery-slide.fullscre .image-gallery-image {
      height: 100vh;
    }

  .image-gallery-svg {
    height: 2rem;
    width: 2rem;

    &:hover {
      // background: #e3e3e3;
      // color: #111;
    }
  }

  .image-gallery-play-button .image-gallery-svg , .image-gallery-icon, .image-gallery-fullscreen-button {
    height: 1.25rem;
    width: 1.25rem;
  }

  .image-gallery-play-button, .image-gallery-fullscreen-button {
    margin-bottom: 2rem;
  }

  .image-gallery-fullscreen-button {
    margin-right: 1rem;
  }


  .image-gallery-fullscreen-button .image-gallery-svg {
    height: 1.25rem !important;
    width: 1.25rem !important;
  }
 
  .image-gallery-fullscreen-button, .image-gallery-play-button {
    bottom: 0;
    padding: 20px;
    padding-bottom: 0px;
  }

  .image-gallery-right-nav {
    margin-right: 20px;
  }

  .image-gallery-thumbnails-wrapper.left, .image-gallery-thumbnails-wrapper.right {
    width: 150px;
  }

  .image-gallery-slide-wrapper.left, .image-gallery-slide-wrapper.right {
    width: calc(100% - 160px);
  }

  .image-gallery-thumbnail {
    width: 150px;
  }

  .image-gallery-slide-wrapper.left, .image-gallery-slide-wrapper.right {
    background-color: #EBEDEF;
  }

  .image-gallery-thumbnail.active, .image-gallery-thumbnail:hover, .image-gallery-thumbnail:focus {
    outline: none;
    border: 4px solid #51508A;
  }

  @media(max-width: 768px) {
    .image-gallery-content.right .image-gallery-slide .image-gallery-image {
      max-height: 40vh;
    }

    .image-gallery-thumbnails-wrapper.left, .image-gallery-thumbnails-wrapper.right {
      width: 100px;
    }
  
    .image-gallery-slide-wrapper.left, .image-gallery-slide-wrapper.right {
      width: calc(100% - 110px);
    }
  
    .image-gallery-thumbnail {
      width: 100px;
    }
  
  }
`

export const Cijena = styled.div`
  font-size: 26px;
  color: #3C4B64;
  margin-top: -0.5rem;
  display: flex;
  align-items: start;
`

export const PitanjeContainer = styled(FlexCol)`
  border: 1px solid #51508A;
  width: 100%;
  padding: 0.875rem 1rem;
  margin-bottom: 0.75rem;
  padding-right: 30px;
  position: relative;
  background-color: #f5f5f5;
  border-radius: 0.25rem;
`


export const Username = styled(FlexCol)`
  font-weight: 600;
`

export const Datetime = styled(FlexCol)`
  font-weight: 300;

`

export const KomentarTekst = styled(FlexCol)`
    justify-content: center;  
    padding-left: 1rem;
`

export const OdgovorButtonContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`

export const Sekcija = styled(FlexCol)`
  font-size: 26px;
  margin-bottom: 1rem;
  text-decoration: underline;
`

export const NaslovArtikal = styled(FlexCol)`
  font-size: 26px;
  margin-bottom: 1rem;
`

export const StarsContainer = styled(FlexCol)`

`

export const Strikethrough = styled.span`
    text-decoration: line-through;
    margin-left: 0.25rem;
    font-size: 14px;
`