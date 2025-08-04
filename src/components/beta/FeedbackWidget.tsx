"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MessageCircle, Star, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeedbackWidgetProps {
  variant?: "button" | "card";
  className?: string;
}

export function FeedbackWidget({ variant = "button", className }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!feedback.trim() || !category) {
      toast({
        title: "Incomplete feedback",
        description: "Please provide feedback text and select a category.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, this would send to your feedback API
      const feedbackData = {
        feedback: feedback.trim(),
        category,
        rating: rating || null,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        page: window.location.pathname,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Beta Feedback Submitted:", feedbackData);

      toast({
        title: "Feedback submitted!",
        description: "Thank you for helping us improve TimeROI. Your insights are valuable.",
      });

      // Reset form
      setFeedback("");
      setCategory("");
      setRating("");
      setIsOpen(false);

    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact support directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const FeedbackForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="category">Feedback Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="data-insights">Data & Insights</SelectItem>
            <SelectItem value="ui-ux">User Interface</SelectItem>
            <SelectItem value="calendar-integration">Calendar Integration</SelectItem>
            <SelectItem value="analytics">Analytics Dashboard</SelectItem>
            <SelectItem value="time-tagging">Time Tagging System</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="feature-request">Feature Request</SelectItem>
            <SelectItem value="bug-report">Bug Report</SelectItem>
            <SelectItem value="general">General Feedback</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="rating">Overall Experience (Optional)</Label>
        <Select value={rating} onValueChange={setRating}>
          <SelectTrigger>
            <SelectValue placeholder="Rate your experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
            <SelectItem value="4">⭐⭐⭐⭐ Good</SelectItem>
            <SelectItem value="3">⭐⭐⭐ Average</SelectItem>
            <SelectItem value="2">⭐⭐ Poor</SelectItem>
            <SelectItem value="1">⭐ Very Poor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="feedback">Your Feedback</Label>
        <Textarea
          id="feedback"
          placeholder="As a CFO/Executive, I would like to see..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>

      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>Submitting...</>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Submit Feedback
          </>
        )}
      </Button>
    </div>
  );

  if (variant === "card") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Beta Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FeedbackForm />
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
        //   variant="outline" 
          size="sm"
          className={`fixed bottom-4 right-4 z-50 ${className || ''}`}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Beta Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Beta Feedback</DialogTitle>
          <DialogDescription>
            Help us improve TimeROI with your executive insights. Your feedback directly shapes our product development.
          </DialogDescription>
        </DialogHeader>
        <FeedbackForm />
      </DialogContent>
    </Dialog>
  );
}
