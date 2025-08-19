import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Loader2, Mail, User, Tag, MessageSquare } from 'lucide-react'
import './App.css'

function App() {
  const [emailContent, setEmailContent] = useState('')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const processEmail = async () => {
    if (!emailContent.trim()) {
      setError('Please enter email content to process')
      return
    }

    setProcessing(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/email/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_content: emailContent
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(`Failed to process email: ${err.message}`)
    } finally {
      setProcessing(false)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Service Requests': 'bg-red-100 text-red-800 border-red-200',
      'Consultation Requests': 'bg-blue-100 text-blue-800 border-blue-200',
      'Payments': 'bg-green-100 text-green-800 border-green-200',
      'Others': 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[category] || colors['Others']
  }

  const clearForm = () => {
    setEmailContent('')
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Mail className="h-12 w-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Email Processor</h1>
          </div>
          <p className="text-lg text-gray-600">AI-powered email classification and information extraction</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Email Content
              </CardTitle>
              <CardDescription>
                Paste your email content below to extract sender information and classify it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your email content here..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={processEmail} 
                  disabled={processing || !emailContent.trim()}
                  className="flex-1"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Process Email'
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={clearForm}
                  disabled={processing}
                >
                  Clear
                </Button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Processing Results
              </CardTitle>
              <CardDescription>
                Extracted information and classification results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  {/* Sender Information */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <User className="h-4 w-4 mr-2 text-gray-600" />
                      <span className="font-medium text-gray-700">Sender Information</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Name:</strong> {result.sender_name || 'Not found'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Greeting:</strong> {result.greeting}
                    </p>
                  </div>

                  {/* Classification */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Tag className="h-4 w-4 mr-2 text-gray-600" />
                      <span className="font-medium text-gray-700">Classification</span>
                    </div>
                    <Badge className={`${getCategoryColor(result.classification)} mb-2`}>
                      {result.classification}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      <strong>Suggested Label:</strong> {result.suggested_label}
                    </p>
                  </div>

                  {/* Email Snippet */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Mail className="h-4 w-4 mr-2 text-gray-600" />
                      <span className="font-medium text-gray-700">Email Snippet</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      "{result.email_snippet}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No results yet. Process an email to see the analysis.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Categories Info */}
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle>Available Categories</CardTitle>
            <CardDescription>
              The system classifies emails into the following categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <Badge className="bg-red-100 text-red-800 border-red-200 mb-2">Service Requests</Badge>
                <p className="text-sm text-gray-600">
                  Requesting assistance for issues or services
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-2">Consultation Requests</Badge>
                <p className="text-sm text-gray-600">
                  Requesting consultations or meetings
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <Badge className="bg-green-100 text-green-800 border-green-200 mb-2">Payments</Badge>
                <p className="text-sm text-gray-600">
                  Payment confirmations and processing
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <Badge className="bg-gray-100 text-gray-800 border-gray-200 mb-2">Others</Badge>
                <p className="text-sm text-gray-600">
                  Emails that don't fit other categories
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

