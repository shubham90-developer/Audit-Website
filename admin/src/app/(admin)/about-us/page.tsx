import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import AboutHero from './aboutUs'

export const metadata: Metadata = { title: 'About Us' }

const AboutUsPage = () => {
  return (
    <>
      <PageTItle title="About Us" />
      <AboutHero />
    </>
  )
}

export default AboutUsPage
