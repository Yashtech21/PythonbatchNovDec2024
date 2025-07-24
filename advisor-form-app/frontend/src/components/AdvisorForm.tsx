import React, { useState } from 'react';
import { Card, Tab, Tabs, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

interface FormData {
  // Personal Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Address
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Professional Details
  advisorId: string;
  department: string;
  startDate: string;
  active: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const AdvisorForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    advisorId: '',
    department: '',
    startDate: '',
    active: true
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const departmentOptions = [
    'Sales',
    'Marketing',
    'Finance',
    'Operations',
    'Human Resources',
    'Information Technology',
    'Customer Service',
    'Research & Development',
    'Legal',
    'Administration'
  ];

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateTab = (tab: string): boolean => {
    const newErrors: FormErrors = {};
    
    switch (tab) {
      case 'personal':
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
        
      case 'address':
        if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) {
          newErrors.zipCode = 'ZIP code is required';
        } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
          newErrors.zipCode = 'Please enter a valid ZIP code';
        }
        break;
        
      case 'professional':
        if (!formData.advisorId.trim()) newErrors.advisorId = 'Advisor ID is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateTab(activeTab)) {
      if (activeTab === 'personal') {
        setActiveTab('address');
      } else if (activeTab === 'address') {
        setActiveTab('professional');
      }
    }
  };

  const handleBack = () => {
    if (activeTab === 'address') {
      setActiveTab('personal');
    } else if (activeTab === 'professional') {
      setActiveTab('address');
    }
  };

  const handleSubmit = async () => {
    if (!validateTab('professional')) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      const response = await axios.post('http://localhost:5000/api/submit-advisor', formData);
      
      if (response.status === 200) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          streetAddress: '',
          city: '',
          state: '',
          zipCode: '',
          advisorId: '',
          department: '',
          startDate: '',
          active: true
        });
        setActiveTab('personal');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setSubmitError(
        error.response?.data?.error || 
        'Failed to submit advisor data. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow">
      <Card.Body>
        {submitSuccess && (
          <Alert variant="success" className="mb-4">
            Advisor information has been successfully submitted and saved to Excel file!
          </Alert>
        )}
        
        {submitError && (
          <Alert variant="danger" className="mb-4">
            {submitError}
          </Alert>
        )}
        
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => k && setActiveTab(k)}
          className="mb-4"
          fill
        >
          <Tab eventKey="personal" title="Personal Details">
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      isInvalid={!!errors.firstName}
                      placeholder="Enter first name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      isInvalid={!!errors.lastName}
                      placeholder="Enter last name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      isInvalid={!!errors.email}
                      placeholder="Enter email address"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Tab>
          
          <Tab eventKey="address" title="Address">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Street Address <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  isInvalid={!!errors.streetAddress}
                  placeholder="Enter street address"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.streetAddress}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>City <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      isInvalid={!!errors.city}
                      placeholder="Enter city"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.city}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>State <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      isInvalid={!!errors.state}
                    >
                      <option value="">Select state</option>
                      {stateOptions.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.state}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>ZIP Code <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      isInvalid={!!errors.zipCode}
                      placeholder="12345"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.zipCode}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Tab>
          
          <Tab eventKey="professional" title="Professional Details">
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Advisor ID <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.advisorId}
                      onChange={(e) => handleInputChange('advisorId', e.target.value)}
                      isInvalid={!!errors.advisorId}
                      placeholder="Enter advisor ID"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.advisorId}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      isInvalid={!!errors.department}
                    >
                      <option value="">Select department</option>
                      {departmentOptions.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.department}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      isInvalid={!!errors.startDate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.startDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Check
                      type="checkbox"
                      label="Active"
                      checked={formData.active}
                      onChange={(e) => handleInputChange('active', e.target.checked)}
                      className="mt-2"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Tab>
        </Tabs>
        
        <div className="d-flex justify-content-between">
          <Button
            variant="outline-secondary"
            onClick={handleBack}
            disabled={activeTab === 'personal'}
          >
            ← Back
          </Button>
          
          <div>
            {activeTab !== 'professional' ? (
              <Button
                variant="primary"
                onClick={handleNext}
              >
                Next →
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AdvisorForm;