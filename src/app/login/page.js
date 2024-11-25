import {Card, CardBody, CardHeader, Spinner} from "@nextui-org/react";
import LogIn from "@/app/login/login";
import {Suspense} from "react";

export default function Login() {
    return (
        <main className="h-full dark bg-default-900 overflow-y-scroll overflow-x-hidden transition-all scroll-smooth px-6 flex flex-col justify-center items-center">
            <Card className="w-full max-w-md bg-opacity-50 bg-default-800 border-none rounded-lg" radius="md" shadow="sm">
                <CardHeader className="flex flex-col items-center mt-4 mx-4">
                    <h1>Log In</h1>
                </CardHeader>
                <CardBody className="p-6 pt-4 overflow-auto">
                    <Suspense fallback={
                        <div className="flex flex-col justify-center items-center gap-6 pulse-trigger w-full h-96">
                            <Spinner size="lg" color="primary" />
                        </div>
                    }>
                        <LogIn/>
                    </Suspense>
                </CardBody>
            </Card>
        </main>
    )
}