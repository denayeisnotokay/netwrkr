'use client'

import UPreloader from "./_components/preloader";
import { Avatar, Card, CardHeader, CardBody, Divider, Button } from '@nextui-org/react';
import { BsBookmarkStar, BsBookmarkStarFill, BsJournalArrowUp, BsJournalText, BsPencilSquare, BsPersonCheck, BsStars } from "react-icons/bs";
import Prtctr from "@/app/_components/auth/protector";

export default function Home() {

  return (
    <UPreloader>
      <Prtctr>
        <Card className="w-full  space-between mt-6 bg-default-700">
          <CardBody className="flex flex-row items-center justify-between p-8">
            <div className="flex flex-row items-center">
              <Avatar radius="full" size="md" src="images/blank_profile_image.png" alt="Profile" className="w-20 h-20 border-b-gray-600" />
              <h2 className="px-4">Welcome back, User!</h2>
            </div>
            <div className="flex flex-row items-center gap-5">
              <div>
                <p>0</p>
                <p>Essays Pending Review</p>
              </div>
              <div>
                <p>0</p>
                <p>Essays Reviewed</p>
              </div>
              <div>
                <Button color="primary" variant={'ghost'} href="/profile ">View Profile</Button>
              </div>
            </div>

          </CardBody>
        </Card>
        <div className="w-full flex flex-row pt-4 gap-4">
          <Card className="flex w-1/2 min-h-32 bg-default-800 p-4">
            <CardHeader className="">
              <BsStars className="text-2xl"></BsStars>
              <div className="px-4">
                <h3>Get Started</h3>
                <p>Follow these steps to begin your journey with UBound</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col">
              <div className="flex flex-row p-2 justify-between items-center">
                <div className="flex flex-row">
                  <BsJournalText className="text-2xl"></BsJournalText>
                  <div className="px-4">
                    <h4>Read the Guide to learn how to get started</h4>
                  </div>
                </div>
                <Button color={'primary'} variant={'ghost'} href="/guide" >Read</Button>
              </div>
              <div className="flex flex-row p-2 justify-between items-center">
                <div className="flex flex-row">
                  <BsPersonCheck className="text-2xl"></BsPersonCheck>
                  <div className="px-4">
                    <h4>Finish Setting up your profile</h4>
                  </div>
                </div>
                <Button color={'primary'} variant={'ghost'} href="/profile">Complete</Button>
              </div>
              <div className="flex flex-row p-2 justify-between items-center">
                <div className="flex flex-row">
                  <BsJournalArrowUp className="text-2xl"></BsJournalArrowUp>
                  <div className="px-4">
                    <h4>Upload your essays to your essay library</h4>
                  </div>
                </div>
                <Button color={'primary'} variant={'ghost'} href="/essays">Complete</Button>
              </div>

            </CardBody>
          </Card>
          <Card className="flex w-1/2 min-h-32 bg-default-800 p-4">
            <CardHeader className="">
              <BsBookmarkStarFill className="text-2xl"></BsBookmarkStarFill>
              <div className="px-4">
                <h3>Review your Feedback</h3>
                <p>Read your feedback and plan your next steps in your application</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col">
              <div className="flex flex-row p-2 justify-between items-center">
                <div className="flex flex-row">
                  <BsJournalText className="text-2xl"></BsJournalText>
                  <div className="px-4">
                    <h4>Check out my feedback</h4>
                  </div>
                </div>
                <Button color={'primary'} variant={'ghost'} href="/guide" >Read</Button>
              </div>
              <div className="flex flex-row p-2 justify-between items-center">
                <div className="flex flex-row">
                  <BsPencilSquare className="text-2xl"></BsPencilSquare>
                  <div className="px-4">
                    <h4>Refine, Refine, Refine</h4>
                  </div>
                </div>
                <Button color={'primary'} variant={'ghost'} href="/essays">Essays</Button>
              </div>
              <div className="flex flex-row p-2 justify-between items-center">
                <div className="flex flex-row">
                  <BsJournalArrowUp className="text-2xl"></BsJournalArrowUp>
                  <div className="px-4">
                    <h4>Upload your revised essays to your essay library</h4>
                  </div>
                </div>
                <Button color={'primary'} variant={'ghost'} href="/essays">Complete</Button>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="w-full py-4">
          <Card className="w-full h-full bg-default-800 p-4">
            <CardHeader className="">
              <BsBookmarkStar className="text-2xl" ></BsBookmarkStar>
              <div className="px-4">
                <h3>Recommended & Available Ambassadors</h3>
                <p>These Ambassadors are chosen based on their rating and feedback from UBound students</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <UAmbassadorList />
            </CardBody>
          </Card>
        </div>
      </Prtctr>
    </UPreloader>
  );
}



