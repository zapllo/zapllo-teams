'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Building,
  MapPin,
  Phone,
  Globe,
  Upload,
  X,
  Check,
  AlertCircle,
  Save
} from 'lucide-react';

// UI Components
import Loader from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PayslipData {
  name: string;
  address: string;
  contact: string;
  emailOrWebsite: string;
  logo: string;
}

export default function PayslipDetailsPage() {
  const [formData, setFormData] = useState<PayslipData>({
    name: '',
    address: '',
    contact: '',
    emailOrWebsite: '',
    logo: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle logo file selection and generate preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleNewFile(file);
    }
  };

  const handleNewFile = (file: File) => {
    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 5MB');
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleNewFile(e.dataTransfer.files[0]);
    }
  };

  // Fetch existing payslip details
  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        const response = await axios.get('/api/payslip');
        if (response.data.success) {
          const { name, address, contact, emailOrWebsite, logo } = response.data.data;
          setFormData({ name, address, contact, emailOrWebsite, logo });
          if (logo) setLogoPreview(logo);
        }
      } catch (error) {
        console.error('Error fetching payslip:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPayslip();
  }, []);

  // Upload the logo and create the payslip
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.contact || !formData.emailOrWebsite) {
      toast.error('Please fill in all required fields');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      let logoUrl = formData.logo;

      // If a new logo is selected, upload it
      if (logoFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('files', logoFile);

        const uploadResponse = await axios.post('/api/upload', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        logoUrl = uploadResponse.data.fileUrls[0];
      }

      // Submit the payslip details
      const payslipResponse = await axios.post('/api/payslip', {
        ...formData,
        logo: logoUrl,
      });

      if (payslipResponse.data.success) {
        toast.success('Payslip details saved successfully!');
        setSuccessMessage('Payslip details saved successfully!');
      } else {
        toast.error('Failed to save payslip details');
        setErrorMessage('Failed to save payslip details.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while saving payslip details');
      setErrorMessage('An error occurred while saving payslip details.');
    } finally {
      setLoading(false);
    }
  };

  // Remove logo
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setFormData({ ...formData, logo: '' });
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container max-w- mx-auto p-6">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Payslip Details</h1>
        <p className="text-muted-foreground">
          Configure your company information for payslip generation
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Company Logo</CardTitle>
              <CardDescription>
                Upload your company logo to appear on payslips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {!logoPreview ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-4">
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="p-3 rounded-full bg-primary/10">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <Label
                      htmlFor="logo-upload"
                      className="text-sm font-medium cursor-pointer text-primary hover:underline"
                    >
                      Click to upload
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      Drag and drop your logo here or click to browse
                      <br />
                      Supports JPG, PNG or GIF up to 5MB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center relative">
                    <div className="relative w-full max-w-[250px]">
                      <img
                        src={logoPreview}
                        alt="Company Logo"
                        className="w-full h-auto object-contain rounded-lg max-h-[120px]"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={handleRemoveLogo}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Logo will be displayed on all generated payslips
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Company Information Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Company Information</CardTitle>
              <CardDescription>
                Enter your company details to appear on payslips
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5" />
                  Company Name
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter company name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Company Address
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  Contact Number
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  placeholder="Enter contact number"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailOrWebsite" className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  Website or Email
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="emailOrWebsite"
                  name="emailOrWebsite"
                  placeholder="Enter website URL or email address"
                  value={formData.emailOrWebsite}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Messages */}
        {errorMessage && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mt-6 border-green-500 text-green-500 bg-green-500/10">
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full mt-6"
          disabled={loading}
          size="lg"
        >
          {loading ? (
            <>
              <Loader />
              Saving changes...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Payslip Details
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
