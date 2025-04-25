
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Calendar, CircleCheck, Share } from 'lucide-react';
import { toast } from 'sonner';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose }) => {
  const [checkmarkVisible, setCheckmarkVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      // Start animation sequence
      const checkmarkTimer = setTimeout(() => setCheckmarkVisible(true), 300);
      const messageTimer = setTimeout(() => setMessageVisible(true), 800);
      const actionsTimer = setTimeout(() => setActionsVisible(true), 1300);
      
      return () => {
        clearTimeout(checkmarkTimer);
        clearTimeout(messageTimer);
        clearTimeout(actionsTimer);
      };
    } else {
      // Reset animations when modal closes
      setCheckmarkVisible(false);
      setMessageVisible(false);
      setActionsVisible(false);
    }
  }, [open]);

  const handleAddToCalendar = () => {
    toast.success("Added to your calendar", {
      description: "WiFi service activation has been added to your calendar"
    });
  };

  const handleShareReferral = () => {
    toast.success("Referral link generated", {
      description: "Share this link with your friends to earn data rewards"
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md flex flex-col items-center text-center p-6 bg-gradient-to-b from-white to-blue-50 border-2 border-primary/20">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {checkmarkVisible && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-checkmark">
                <CircleCheck className="h-16 w-16 text-primary" />
              </div>
            </div>
          )}
        </div>
        
        {messageVisible && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-2xl font-bold text-primary">You're in!</h2>
            <p className="text-base text-gray-600">
              Welcome to blazing-fast internet that <span className="text-primary font-semibold">#NeverSleeps</span>. 
              <br />Expect smooth speeds and no drops — ever.
            </p>
          </div>
        )}
        
        {actionsVisible && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 animate-fade-in">
            <Button 
              onClick={handleAddToCalendar} 
              variant="outline" 
              className="gap-2 border-primary/30 hover:bg-primary/5"
            >
              <Calendar size={18} />
              Add to Calendar
            </Button>
            <Button 
              onClick={handleShareReferral} 
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Share size={18} />
              Share Referral
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
