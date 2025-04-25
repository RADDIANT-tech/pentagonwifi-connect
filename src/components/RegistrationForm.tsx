import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Check, CircleCheck, CircleX, MapPin, Phone, Signature, User } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedInput from './AnimatedInput';
import SuccessModal from './SuccessModal';

const formSchema = z.object({
  fullName: z.string().min(3, {
    message: "Full name must be at least 3 characters.",
  }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  blockCourt: z.string({
    required_error: "Please select a block or court.",
  }),
  roomType: z.string({
    required_error: "Please select a room type.",
  }),
  roomNumber: z.string().min(1, {
    message: "Room number is required.",
  }),
  isCustodian: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const RegistrationForm: React.FC = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isNameValid, setIsNameValid] = useState<boolean | undefined>(undefined);
  const [isPhoneValid, setIsPhoneValid] = useState<boolean | undefined>(undefined);
  const [isRoomNumberValid, setIsRoomNumberValid] = useState<boolean | undefined>(undefined);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      blockCourt: "",
      roomType: "",
      roomNumber: "",
      isCustodian: false,
    },
  });
  
  const watchIsCustodian = form.watch("isCustodian");
  
  // Validate full name with regex (letters, spaces, hyphens, and apostrophes)
  const validateName = (name: string) => {
    if (!name) return undefined;
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    const isValid = nameRegex.test(name) && name.length >= 3;
    setIsNameValid(isValid);
    return isValid;
  };
  
  // Validate and format phone number
  const validatePhone = (phoneNumber: string) => {
    if (!phoneNumber) return undefined;
    // Simple validation for demo - requires at least 10 digits
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    const isValid = digitsOnly.length >= 10;
    setIsPhoneValid(isValid);
    return isValid;
  };
  
  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    if (!value) return "";
    
    // Keep only digits
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format based on length
    if (digitsOnly.length <= 3) {
      return `+${digitsOnly}`;
    } else if (digitsOnly.length <= 6) {
      return `+${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`;
    } else if (digitsOnly.length <= 9) {
      return `+${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6)}`;
    } else {
      return `+${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 9)} ${digitsOnly.slice(9, 12)}`;
    }
  };
  
  // Validate room number (numeric only)
  const validateRoomNumber = (roomNumber: string) => {
    if (!roomNumber) return undefined;
    const isValid = /^\d+$/.test(roomNumber);
    setIsRoomNumberValid(isValid);
    return isValid;
  };
  
  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
    // Simulate form submission with a delay
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Connecting you to Pentagon WiFi...',
        success: () => {
          // Show success modal after toast completes
          setTimeout(() => setIsSuccessModalOpen(true), 300);
          return 'Registration complete!';
        },
        error: 'Registration failed. Please try again.'
      }
    );
  };

  // Auto-capitalize name while typing
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'fullName' && typeof value.fullName === 'string') {
        // Auto-capitalize first letter of each word
        const capitalized = value.fullName.replace(/\b\w/g, c => c.toUpperCase());
        if (capitalized !== value.fullName) {
          form.setValue('fullName', capitalized);
        }
        validateName(capitalized);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AnimatedInput
                    id="fullName"
                    label="Full Name"
                    type="text"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      validateName(e.target.value);
                    }}
                    icon={<Signature className="h-5 w-5" />}
                    validationIcon={isNameValid ? <CircleCheck className="h-5 w-5" /> : <CircleX className="h-5 w-5" />}
                    isValid={isNameValid}
                    autoComplete="name"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Date of Birth */}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="relative form-field-animation rounded-lg max-w-md">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <div className="flex items-center border-2 rounded-lg overflow-hidden">
                          <div className="flex items-center justify-center pl-3 text-gray-500">
                            <CalendarIcon className="h-5 w-5" />
                          </div>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-left font-normal py-3 px-2 h-auto",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Date of Birth</span>}
                          </Button>
                        </div>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          if (date) {
                            const currentYear = new Date().getFullYear();
                            const age = currentYear - date.getFullYear();
                            if (age >= 18) {
                              toast.success("Age verification successful", {
                                description: "You're in!"
                              });
                            } else {
                              toast.warning("Age verification", {
                                description: "You must be at least 18 years old."
                              });
                            }
                          }
                        }}
                        disabled={(date) => {
                          // Disable future dates and dates more than 100 years in the past
                          const now = new Date();
                          const hundredYearsAgo = new Date();
                          hundredYearsAgo.setFullYear(now.getFullYear() - 100);
                          return date > now || date < hundredYearsAgo;
                        }}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormItem>
            )}
          />
          
          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AnimatedInput
                    id="phoneNumber"
                    label="Phone Number"
                    type="tel"
                    value={field.value}
                    onChange={(e) => {
                      const formattedValue = formatPhoneNumber(e.target.value);
                      field.onChange(formattedValue);
                      validatePhone(formattedValue);
                    }}
                    icon={<Phone className="h-5 w-5" />}
                    validationIcon={isPhoneValid ? <CircleCheck className="h-5 w-5" /> : <CircleX className="h-5 w-5" />}
                    isValid={isPhoneValid}
                    autoComplete="tel"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Block / Court */}
          <FormField
            control={form.control}
            name="blockCourt"
            render={({ field }) => (
              <FormItem className="form-field-animation">
                <div className="relative max-w-md">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center pl-3 text-gray-500">
                      <MapPin className="h-5 w-5 animate-pulse-slow" />
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full border-2 border-gray-200 focus:border-primary py-3">
                        <SelectValue placeholder="Select Block / Court" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="block-a">Block A</SelectItem>
                        <SelectItem value="block-b">Block B</SelectItem>
                        <SelectItem value="block-c">Block C</SelectItem>
                        <SelectItem value="addis-ababa">Addis-Ababa Court</SelectItem>
                        <SelectItem value="dar-es-salam">Dar es Salam Court</SelectItem>
                        <SelectItem value="kampala">Kampala Court</SelectItem>
                        <SelectItem value="nairobi">Nairobi Court</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FormItem>
            )}
          />
          
          {/* Room Type */}
          <FormField
            control={form.control}
            name="roomType"
            render={({ field }) => (
              <FormItem className="form-field-animation">
                <div className="relative max-w-md">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center pl-3 text-gray-500">
                      <User className="h-5 w-5" />
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full border-2 border-gray-200 focus:border-primary py-3">
                        <SelectValue placeholder="Select Room Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="one-in-room">1 in a room</SelectItem>
                        <SelectItem value="two-in-room">2 in a room</SelectItem>
                        <SelectItem value="three-in-room">3 in a room</SelectItem>
                        <SelectItem value="four-in-room">4 in a room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FormItem>
            )}
          />
          
          {/* Room Number */}
          <FormField
            control={form.control}
            name="roomNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AnimatedInput
                    id="roomNumber"
                    label="Room Number"
                    type="text"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      validateRoomNumber(e.target.value);
                    }}
                    validationIcon={isRoomNumberValid ? <CircleCheck className="h-5 w-5" /> : <CircleX className="h-5 w-5" />}
                    isValid={isRoomNumberValid}
                    maxWidth="max-w-[150px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Be a Custodian */}
          <div className="pt-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-primary/5 to-accent/10 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-primary">Host. Lead. Connect.</h3>
                  <p className="text-sm text-gray-600 max-w-md">
                    Want to be more than just connected? Become a Custodian — host the router, lead the connection, and earn weekly data rewards. Terms apply.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="isCustodian"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              toast("Custodian mode activated!", {
                                description: "You'll receive extra benefits and data rewards."
                              });
                            }
                          }}
                          className={cn(
                            "data-[state=checked]:bg-primary", 
                            "data-[state=checked]:after:bg-accent",
                            "transition-shadow",
                            "focus-visible:ring-4 focus-visible:ring-primary/40"
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Conditionally show additional custodian fields */}
              {watchIsCustodian && (
                <div className="mt-4 space-y-4 bg-white/80 p-3 rounded-md animate-fade-in">
                  <h4 className="font-medium text-primary">Custodian Details</h4>
                  <div className="text-sm text-gray-600">
                    <p>As a custodian, you'll receive:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>50% extra data allocation weekly</li>
                      <li>Priority support for any issues</li>
                      <li>Router maintenance training</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full py-6 text-lg bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg"
            >
              <span className="mr-2">Connect Me</span>
              <Check className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </Form>
      
      <SuccessModal 
        open={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
      />
    </div>
  );
};

export default RegistrationForm;
