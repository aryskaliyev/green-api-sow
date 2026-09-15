"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"

export default function Page() {
  const [instanceId, setInstanceId] = useState("")
  const [apiToken, setApiToken] = useState("")
  const [phoneForSendMessage, setPhoneForSendMessage] = useState("")
  const [message, setMessage] = useState("")
  const [phoneForSendFile, setPhoneForSendFile] = useState("")
  const [fileUrl, setFileUrl] = useState("")

  const isFormValid = instanceId.trim() !== "" && apiToken.trim() !== ""

  const [getSettingsLoading, setGetSettingsLoading] = useState(false)
  const [getStateInstanceLoading, setGetStateInstanceLoading] = useState(false)
  const [data, setData] = useState<unknown>(null)
  const [sendMessageLoading, setSendMessageLoading] = useState(false)
  const [sendFileLoading, setSendFileLoading] = useState(false)

  const baseUrl = "https://api.green-api.com"

  async function getSettingsRequest() {
    setGetSettingsLoading(true)

    try {
      const response = await fetch(
        `${baseUrl}/waInstance${instanceId}/getSettings/${apiToken}`,
        { method: "GET" }
      )

      const result = await response.json()
      setData(result)
    } catch (err) {
      setData({
        error: err instanceof Error ? err.message : "Something went wrong",
      })
    } finally {
      setGetSettingsLoading(false)
    }
  }

  async function getStateInstanceRequest() {
    setGetStateInstanceLoading(true)

    try {
      const response = await fetch(
        `${baseUrl}/waInstance${instanceId}/getStateInstance/${apiToken}`,
        { method: "GET" }
      )

      const result = await response.json()
      setData(result)
    } catch (err) {
      setData({
        error: err instanceof Error ? err.message : "Something went wrong",
      })
    } finally {
      setGetStateInstanceLoading(false)
    }
  }

  async function sendMessageRequest(phone: string, message: string) {
    setSendMessageLoading(true)

    try {
      const response = await fetch(
        `${baseUrl}/waInstance${instanceId}/sendMessage/${apiToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: `${phone}@c.us`,
            message: message,
          }),
        }
      )

      const result = await response.json()
      setData(result)
    } catch (err) {
      setData({
        error: err instanceof Error ? err.message : "Something went wrong",
      })
    } finally {
      setSendMessageLoading(false)
    }
  }

  async function sendFileByUrlRequest(phone: string, fileUrl: string) {
    setSendFileLoading(true)

    try {
      const response = await fetch(
        `${baseUrl}/waInstance${instanceId}/sendFileByUrl/${apiToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: `${phone}@c.us`,
            urlFile: fileUrl,
            fileName:
              fileUrl.split(/[?#]/)[0].split("/").filter(Boolean).pop() ?? "",
          }),
        }
      )

      const result = await response.json()
      setData(result)
    } catch (err) {
      setData({
        error: err instanceof Error ? err.message : "Something went wrong",
      })
    } finally {
      setSendFileLoading(false)
    }
  }

  const handleGetSettings = () => getSettingsRequest()
  const handleGetStateInstance = () => getStateInstanceRequest()
  const handleSendMessage = () =>
    sendMessageRequest(phoneForSendMessage, message)
  const handleSendFileByUrl = () =>
    sendFileByUrlRequest(phoneForSendFile, fileUrl)

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
      {/* REQUEST */}
      <div className="flex flex-col space-y-4">
        <Card className="px-4">
          <CardHeader>
            <CardTitle>Request</CardTitle>
            <CardDescription>
              Enter instance ID and API token to send requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel htmlFor="instance-id">Instance ID</FieldLabel>
              <Input
                id="instance-id"
                type="text"
                placeholder="Instance ID is required"
                value={instanceId}
                onChange={(e) => setInstanceId(e.target.value)}
              />
            </Field>
          </CardContent>
          <CardContent>
            <Field>
              <FieldLabel htmlFor="api-token">API Token</FieldLabel>
              <Input
                id="api-token"
                type="text"
                placeholder="API Token is required"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
              />
            </Field>
          </CardContent>
          <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <CardAction className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled={!isFormValid || getSettingsLoading}
                onClick={handleGetSettings}
              >
                {getSettingsLoading ? <Spinner /> : "Get Settings"}
              </Button>
            </CardAction>
            <CardAction className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled={!isFormValid || getStateInstanceLoading}
                onClick={handleGetStateInstance}
              >
                {getStateInstanceLoading ? <Spinner /> : "Get Instance State"}
              </Button>
            </CardAction>
          </CardContent>
        </Card>

        {/* SEND MESSAGE */}
        <Card>
          <CardHeader>
            <CardTitle>Send Message</CardTitle>
            <CardDescription>
              Enter phone number and text to send the message
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel htmlFor="form-phone">Phone</FieldLabel>
              <Input
                id="form-phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={phoneForSendMessage}
                onChange={(e) => setPhoneForSendMessage(e.target.value)}
              />
            </Field>
          </CardContent>
          <CardContent>
            <InputGroup>
              <InputGroupTextarea
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </InputGroup>
          </CardContent>
          <CardContent className="flex flex-col justify-end sm:flex-row">
            <CardAction className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled={
                  !isFormValid ||
                  phoneForSendMessage.trim() === "" ||
                  message.trim() === "" ||
                  sendMessageLoading
                }
                onClick={handleSendMessage}
              >
                {sendMessageLoading ? "Loading..." : "Send Message"}
              </Button>
            </CardAction>
          </CardContent>
        </Card>

        {/* SEND FILE BY URL */}
        <Card>
          <CardHeader>
            <CardTitle>Send file by URL</CardTitle>
            <CardDescription>
              Enter phone number and url to send the file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel htmlFor="form-phone">Phone</FieldLabel>
              <Input
                id="form-phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={phoneForSendFile}
                onChange={(e) => setPhoneForSendFile(e.target.value)}
              />
            </Field>
          </CardContent>
          <CardContent>
            <Field>
              <FieldLabel htmlFor="file-url">File URL</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="file-url"
                  placeholder="https://example.com/img/duck.png"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                />
              </InputGroup>
            </Field>
          </CardContent>
          <CardContent className="flex flex-col justify-end sm:flex-row">
            <CardAction className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled={
                  !isFormValid ||
                  phoneForSendFile.trim() === "" ||
                  fileUrl.trim() === "" ||
                  sendFileLoading
                }
                onClick={handleSendFileByUrl}
              >
                {sendFileLoading ? "Loading..." : "Send File by URL"}
              </Button>
            </CardAction>
          </CardContent>
        </Card>
      </div>

      {/* RESPONSE */}
      <div className="flex flex-col">
        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>API response details</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-min-75 h-full w-full rounded-md border p-4">
              <code className="font-mono text-sm whitespace-pre">
                {getSettingsLoading ||
                  getStateInstanceLoading ||
                  sendMessageLoading ||
                  sendFileLoading ? (
                  <Spinner />
                ) : data ? (
                  JSON.stringify(
                    typeof data === "string" ? JSON.parse(data) : data,
                    null,
                    2
                  )
                ) : (
                  "No response yet"
                )}
              </code>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}