import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, ProgressBar, Badge, Modal, Navbar, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { toast, ToastContainer } from 'react-toastify'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadData, setDownloadData] = useState(null)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme))
    }
  }, [])

  const toggleTheme = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', JSON.stringify(newMode))
  }

  const API_CONFIG = {
    instagram: 'https://social-media-video-downloader.p.rapidapi.com/smvd/get/instagram',
    youtube: 'https://social-media-video-downloader.p.rapidapi.com/smvd/get/youtube',
    facebook: 'https://social-media-video-downloader.p.rapidapi.com/smvd/get/facebook',
    tiktok: 'https://social-media-video-downloader.p.rapidapi.com/smvd/get/tiktok'
  }

  const API_HEADERS = {
    'x-rapidapi-key': '394a67752bmshb099586c5eab82bp13b786jsn4372fc29f3c8',
    'x-rapidapi-host': 'social-media-video-downloader.p.rapidapi.com'
  }

  const downloadVideo = async () => {
    if (!url.trim()) {
      toast.error('Please enter a valid URL')
      return
    }

    setLoading(true)
    setProgress(0)
    setError('')
    setDownloadData(null)
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 20
      })
    }, 200)

    try {
      const apiUrl = `${API_CONFIG[platform]}?url=${encodeURIComponent(url)}`
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: API_HEADERS
      })

      const data = await response.json()
      
      if (data.success) {
        console.log('API Response:', data) // Debug log
        
        // Special handling for YouTube
        let formats = []
        if (platform === 'youtube') {
          if (data.formats) {
            formats = data.formats.map((format, index) => ({
              quality: String(format.quality || format.height + 'p' || `Quality ${index + 1}`),
              format: String(format.ext || format.container || 'MP4'),
              url: format.url,
              size: String(format.filesize || format.filesize_approx || 'Unknown size')
            }))
          } else if (data.links) {
            formats = data.links.map((link, index) => ({
              quality: String(link.quality || link.resolution || `Quality ${index + 1}`),
              format: String(link.type || 'MP4'),
              url: link.link || link.url,
              size: String(link.size || 'Unknown size')
            }))
          } else {
            formats = [{
              quality: 'HD',
              format: 'MP4',
              url: data.url || data.download_url || data.link,
              size: 'Unknown size'
            }]
          }
        } else {
          // For other platforms
          formats = data.links ? data.links.map((link, index) => ({
            quality: String(link.quality || link.resolution || `Quality ${index + 1}`),
            format: String(link.type || 'MP4'),
            url: link.link || link.url,
            size: String(link.size || 'Unknown size')
          })) : [{
            quality: 'HD',
            format: 'MP4',
            url: data.link || data.download_url || data.url,
            size: 'Unknown size'
          }]
        }
        
        setDownloadData({
          title: String(data.title || data.meta?.title || data.caption || 'Video'),
          thumbnail: data.picture || data.thumbnail || data.meta?.image || data.cover || data.thumb || '',
          duration: String(data.duration || data.meta?.duration || 'Unknown'),
          author: typeof data.author === 'object' ? data.author?.username || data.author?.full_name || 'Unknown' : String(data.author || data.meta?.author || 'Unknown'),
          formats: formats
        })
        toast.success('Video processed successfully!')
      } else {
        console.log('API Error:', data)
        const errorMsg = data.msg || data.message || data.error || 'Download failed'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (err) {
      console.log('Network Error:', err)
      const errorMsg = `Network error: ${err.message}`
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      clearInterval(progressInterval)
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 500)
    }
  }

  const renderTooltip = (text) => (
    <Tooltip>{text}</Tooltip>
  )

  const scrollToSection = (section) => {
    setActiveSection(section)
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={`app ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Navbar */}
      <Navbar expand="lg" className="custom-navbar" fixed="top">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold">
            <i className="bi bi-camera-video-fill me-2"></i>
            VideoDownloader
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => scrollToSection('home')} className={activeSection === 'home' ? 'active' : ''}>
                <i className="bi bi-house-fill me-1"></i>Home
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection('about')} className={activeSection === 'about' ? 'active' : ''}>
                <i className="bi bi-info-circle-fill me-1"></i>About
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection('services')} className={activeSection === 'services' ? 'active' : ''}>
                <i className="bi bi-gear-fill me-1"></i>Services
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection('how-it-works')} className={activeSection === 'how-it-works' ? 'active' : ''}>
                <i className="bi bi-question-circle-fill me-1"></i>How it Works
              </Nav.Link>
            </Nav>
            <OverlayTrigger placement="bottom" overlay={renderTooltip('Toggle Theme')}>
              <Button 
                variant="outline-warning" 
                onClick={toggleTheme}
                className="theme-toggle"
              >
                <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
              </Button>
            </OverlayTrigger>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={loading} centered backdrop="static">
        <Modal.Body className="text-center p-4">
          <div className="spinner-border text-warning mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Processing your request...</h5>
          <ProgressBar 
            now={progress} 
            variant="warning" 
            className="mb-2"
            style={{height: '10px'}}
          />
          <small>{Math.round(progress)}%</small>
        </Modal.Body>
      </Modal>
      
      {/* Home Section */}
      <section id="home" className="py-5" style={{marginTop: '80px'}}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} xl={6}>
              <div className="text-center mb-5">
                <h1 className="display-4 mb-3">
                  <i className="bi bi-camera-video text-warning me-3"></i>
                  Social Media Downloader
                </h1>
                <p className="lead">Download videos from Instagram, YouTube, Facebook & TikTok</p>
              </div>
            
              <Card className="mb-4 shadow-lg border-0">
                <Card.Body className="p-4">
                  <Form.Group className="mb-4">
                    <Form.Label className="h5 mb-3">
                      <i className="bi bi-collection-play me-2"></i>Select Platform:
                    </Form.Label>
                    <div className="d-flex gap-2 flex-wrap">
                      {[
                        {key: 'instagram', icon: 'bi-instagram', name: 'Instagram', tooltip: 'Download Instagram videos and reels'},
                        {key: 'youtube', icon: 'bi-youtube', name: 'YouTube', tooltip: 'Download YouTube videos'},
                        {key: 'facebook', icon: 'bi-facebook', name: 'Facebook', tooltip: 'Download Facebook videos'},
                        {key: 'tiktok', icon: 'bi-tiktok', name: 'TikTok', tooltip: 'Download TikTok videos'}
                      ].map(p => (
                        <OverlayTrigger key={p.key} placement="top" overlay={renderTooltip(p.tooltip)}>
                          <Button
                            variant={platform === p.key ? 'warning' : 'outline-warning'}
                            onClick={() => setPlatform(p.key)}
                            className="platform-btn"
                          >
                            <i className={`bi ${p.icon} me-2`}></i>{p.name}
                          </Button>
                        </OverlayTrigger>
                      ))}
                    </div>
                  </Form.Group>
                  
                  <Form.Group>
                    <Form.Label className="h5 mb-3">
                      <i className="bi bi-link-45deg me-2"></i>Video URL:
                    </Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        placeholder="Paste your video URL here..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        size="lg"
                      />
                      <OverlayTrigger placement="top" overlay={renderTooltip('Start Download')}>
                        <Button 
                          variant="warning"
                          size="lg"
                          onClick={downloadVideo} 
                          disabled={loading || !url.trim()}
                          className="download-btn"
                        >
                          <i className="bi bi-download me-2"></i>Download
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </Form.Group>
                </Card.Body>
              </Card>
            
              {downloadData && (
                <Card className="shadow-lg border-0">
                  <Card.Header className="bg-success text-white text-center py-3">
                    <h3 className="mb-0">
                      <i className="bi bi-check-circle-fill me-2"></i>Download Ready!
                    </h3>
                  </Card.Header>
                  
                  <Card.Body className="p-4">
                    <Row className="mb-4">
                      <Col md={4}>
                        <div className="thumbnail-container">
                          {downloadData.thumbnail ? (
                            <img 
                              src={downloadData.thumbnail} 
                              alt="Thumbnail" 
                              className="img-fluid rounded"
                              onError={(e) => {
                                e.target.style.display = 'none'
                              }}
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <div className="no-thumbnail d-flex align-items-center justify-content-center rounded">
                              <i className="bi bi-camera-video" style={{fontSize: '3rem'}}></i>
                            </div>
                          )}
                        </div>
                      </Col>
                      
                      <Col md={8}>
                        <h4 className="mb-3">{downloadData.title}</h4>
                        <div className="d-flex gap-3 mb-3">
                          <Badge bg="info">
                            <i className="bi bi-clock me-1"></i>{downloadData.duration}
                          </Badge>
                          {downloadData.author && downloadData.author !== 'Unknown' && (
                            <Badge bg="secondary">
                              <i className="bi bi-person-fill me-1"></i>{downloadData.author}
                            </Badge>
                          )}
                        </div>
                      </Col>
                    </Row>
                    
                    <h5 className="mb-3">
                      <i className="bi bi-download me-2"></i>Available Downloads:
                    </h5>
                    <Row>
                      {downloadData.formats?.map((format, index) => (
                        <Col md={6} lg={4} key={index} className="mb-3">
                          <OverlayTrigger placement="top" overlay={renderTooltip(`Download ${format.quality} ${format.format}`)}>
                            <Card 
                              as="a"
                              href={format.url} 
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="download-card h-100 text-decoration-none"
                            >
                              <Card.Body className="text-center">
                                <i className="bi bi-download mb-2" style={{fontSize: '2rem'}}></i>
                                <h6 className="text-warning">{format.quality}</h6>
                                <small className="text-muted">{format.format}</small>
                                {format.size && format.size !== 'Unknown size' && (
                                  <div><small className="text-info">{format.size}</small></div>
                                )}
                              </Card.Body>
                            </Card>
                          </OverlayTrigger>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="text-center mb-5">
                <h2 className="display-5 mb-3">
                  <i className="bi bi-info-circle text-warning me-3"></i>About Us
                </h2>
                <p className="lead">Your trusted partner for social media content downloading</p>
              </div>
              <Row>
                <Col md={6} className="mb-4">
                  <Card className="h-100 border-0 shadow">
                    <Card.Body className="text-center p-4">
                      <i className="bi bi-shield-check text-warning mb-3" style={{fontSize: '3rem'}}></i>
                      <h5>Secure & Safe</h5>
                      <p>Your privacy is our priority. We don't store any of your data or downloaded content.</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-4">
                  <Card className="h-100 border-0 shadow">
                    <Card.Body className="text-center p-4">
                      <i className="bi bi-lightning text-warning mb-3" style={{fontSize: '3rem'}}></i>
                      <h5>Fast & Reliable</h5>
                      <p>High-speed downloads with multiple quality options for the best user experience.</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section id="services" className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 mb-3">
              <i className="bi bi-gear text-warning me-3"></i>Our Services
            </h2>
            <p className="lead">Comprehensive social media downloading solutions</p>
          </div>
          <Row>
            {[
              {icon: 'bi-instagram', title: 'Instagram Downloader', desc: 'Download Instagram videos, reels, and IGTV content'},
              {icon: 'bi-youtube', title: 'YouTube Downloader', desc: 'Download YouTube videos in various qualities and formats'},
              {icon: 'bi-facebook', title: 'Facebook Downloader', desc: 'Download Facebook videos and live streams'},
              {icon: 'bi-tiktok', title: 'TikTok Downloader', desc: 'Download TikTok videos without watermark'}
            ].map((service, index) => (
              <Col md={6} lg={3} key={index} className="mb-4">
                <Card className="h-100 border-0 shadow service-card">
                  <Card.Body className="text-center p-4">
                    <i className={`bi ${service.icon} text-warning mb-3`} style={{fontSize: '3rem'}}></i>
                    <h5>{service.title}</h5>
                    <p className="text-muted">{service.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 mb-3">
              <i className="bi bi-question-circle text-warning me-3"></i>How It Works
            </h2>
            <p className="lead">Simple steps to download your favorite videos</p>
          </div>
          <Row>
            {[
              {step: '1', icon: 'bi-collection-play', title: 'Select Platform', desc: 'Choose from Instagram, YouTube, Facebook, or TikTok'},
              {step: '2', icon: 'bi-link-45deg', title: 'Paste URL', desc: 'Copy and paste the video URL into the input field'},
              {step: '3', icon: 'bi-download', title: 'Download', desc: 'Click download and choose your preferred quality'}
            ].map((step, index) => (
              <Col md={4} key={index} className="mb-4">
                <Card className="h-100 border-0 shadow text-center">
                  <Card.Body className="p-4">
                    <div className="step-number mb-3">{step.step}</div>
                    <i className={`bi ${step.icon} text-warning mb-3`} style={{fontSize: '2.5rem'}}></i>
                    <h5>{step.title}</h5>
                    <p className="text-muted">{step.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <Row>
            <Col md={6}>
              <h5>
                <i className="bi bi-camera-video-fill me-2"></i>
                Social Media Downloader
              </h5>
              <p className="text-muted">Download videos from your favorite social media platforms quickly and easily.</p>
            </Col>
            <Col md={6}>
              <h6>Quick Links</h6>
              <div className="d-flex gap-3">
                <Button variant="link" className="text-white p-0" onClick={() => scrollToSection('home')}>
                  <i className="bi bi-house-fill me-1"></i>Home
                </Button>
                <Button variant="link" className="text-white p-0" onClick={() => scrollToSection('about')}>
                  <i className="bi bi-info-circle-fill me-1"></i>About
                </Button>
                <Button variant="link" className="text-white p-0" onClick={() => scrollToSection('services')}>
                  <i className="bi bi-gear-fill me-1"></i>Services
                </Button>
              </div>
            </Col>
          </Row>
          <hr className="my-3" />
          <Row>
            <Col className="text-center">
              <p className="mb-0 text-muted">
                © 2024 Social Media Downloader. Made with <i className="bi bi-heart-fill text-danger"></i> for content creators.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
      />
    </div>
  )
}

export default App
