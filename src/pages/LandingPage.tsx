import React from 'react';
import { Link } from 'react-router-dom';
import {
	ArrowRight,
	FileText,
	Users,
	Clock,
	CheckCircle2,
	Sparkles,
	Target,
	Zap,
	Shield,
	BarChart3,
	MessageSquare,
	Briefcase,
	Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedStatCard } from '@/components/common/AnimatedStatCard';
import { Navbar } from '@/components/layout/Navbar';

const LandingPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-background">
			{/* Navigation */}
			<Navbar />

			{/* Hero Section */}
			<section className="relative overflow-hidden py-12 sm:py-24">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						{/* Left Content */}
						<div className="space-y-8">
							<div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
								<Sparkles className="w-4 h-4 mr-2" />
								Guiding Your Projects, Every Step of the Way
							</div>

							<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
								<span className="text-foreground">Modern </span>
								<span className="text-primary italic">Project Brief</span>
								<br />
								<span className="text-foreground italic">Management</span>
								<span className="text-foreground"> For Everyone</span>
							</h1>

							<p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
								Streamline your web development projects with our comprehensive brief builder.
								Collaborate seamlessly between clients and development teams.
							</p>

							<div className="flex flex-col sm:flex-row gap-4">
								<Link to="/login">
									<Button
										size="lg"
										className="shadow-lg hover:shadow-xl transition-all text-base px-8 py-6"
									>
										Talk to Advisor
									</Button>
								</Link>
								<Link to="/login">
									<Button variant="outline" size="lg" className="text-base px-8 py-6 group">
										Try Our Dashboard
										<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
									</Button>
								</Link>
							</div>
						</div>

						{/* Right Content - Placeholder for Image */}
						<div className="relative lg:h-[600px] h-[400px]">
							<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl"></div>
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="absolute inset-0 flex items-center justify-center">
									<img
										src="/images/hero-image.png" // atau {heroImage} jika kamu import dari src/assets
										alt="Hero"
										className="w-full h-full object-cover rounded-3xl"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section - Animated */}
			<section className="py-20 border-y bg-muted/30">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-12">
						<AnimatedStatCard
							icon={CheckCircle2}
							value={500}
							suffix="+"
							label="Projects Completed"
							delay={0}
							iconColor="text-primary"
						/>
						<AnimatedStatCard
							icon={Users}
							value={200}
							suffix="+"
							label="Active Clients"
							delay={0.1}
							iconColor="text-success"
						/>
						<AnimatedStatCard
							icon={Briefcase}
							value={50}
							suffix="+"
							label="Team Members"
							delay={0.2}
							iconColor="text-warning"
						/>
						<AnimatedStatCard
							icon={Award}
							value={15}
							suffix="+"
							label="Years Experience"
							delay={0.3}
							iconColor="text-info"
						/>
					</div>
				</div>
			</section>

			{/* Focus Section */}
			<section className="py-24 bg-background">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-20">
						<h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
							<span className="text-muted-foreground">We </span>
							<span className="text-primary italic">Focus</span>
							<span className="text-foreground"> on Your Project Briefs</span>
						</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							You focus on what matters most - your vision and goals. We handle the complexity of
							project management, collaboration, and delivery.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
							<CardContent className="p-8 text-center">
								<div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
									<FileText className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-bold text-foreground mb-3">Brief Management</h3>
								<p className="text-muted-foreground leading-relaxed">
									Comprehensive project specifications with brand details, design preferences, and
									requirements
								</p>
							</CardContent>
						</Card>

						<Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
							<CardContent className="p-8 text-center">
								<div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
									<MessageSquare className="h-8 w-8 text-success" />
								</div>
								<h3 className="text-xl font-bold text-foreground mb-3">Real-time Collaboration</h3>
								<p className="text-muted-foreground leading-relaxed">
									Seamless communication between clients and development teams throughout the
									project
								</p>
							</CardContent>
						</Card>

						<Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
							<CardContent className="p-8 text-center">
								<div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
									<BarChart3 className="h-8 w-8 text-warning" />
								</div>
								<h3 className="text-xl font-bold text-foreground mb-3">Progress Tracking</h3>
								<p className="text-muted-foreground leading-relaxed">
									Monitor project status, deliverables, and milestones with intuitive dashboards
								</p>
							</CardContent>
						</Card>

						<Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
							<CardContent className="p-8 text-center">
								<div className="w-16 h-16 bg-info/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
									<Shield className="h-8 w-8 text-info" />
								</div>
								<h3 className="text-xl font-bold text-foreground mb-3">Secure Platform</h3>
								<p className="text-muted-foreground leading-relaxed">
									Enterprise-grade security for your project data and client communications
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24 bg-gradient-to-br from-primary/10 via-background to-primary/5">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="bg-card rounded-3xl p-12 sm:p-20 text-center shadow-2xl border relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
						<div className="relative z-10">
							<h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
								Ready to Start Your Project?
							</h2>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
								Join our platform and experience streamlined project collaboration. Whether you're a
								client with a vision or part of our development team, get started today.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link to="/login">
									<Button
										size="lg"
										className="w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all text-base px-10 py-7"
									>
										Login as Client
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>
								<Link to="/login">
									<Button
										variant="outline"
										size="lg"
										className="w-full sm:w-auto text-base px-10 py-7 border-2"
									>
										Admin Login
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t bg-muted/30">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
						<div>
							<div className="mb-4">
								<Link to="/">
									<img src="/images/logo.webp" alt="FTS Logo" className="w-32" />
								</Link>
							</div>
							<p className="text-muted-foreground text-sm leading-relaxed">
								Leading web development company specializing in innovative digital solutions for
								businesses of all sizes.
							</p>
						</div>

						<div>
							<h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>
									<Link to="/login" className="hover:text-primary transition-colors">
										Dashboard
									</Link>
								</li>
								<li>
									<Link to="/login" className="hover:text-primary transition-colors">
										Create Brief
									</Link>
								</li>
								<li>
									<Link to="/login" className="hover:text-primary transition-colors">
										Projects
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="font-semibold text-foreground mb-4">Contact</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>Email: info@fujiyama-tech.com</li>
								<li>Phone: +62 (0) 123-4567</li>
								<li>Jakarta, Indonesia</li>
							</ul>
						</div>
					</div>

					<div className="border-t pt-8">
						<p className="text-center text-muted-foreground text-sm">
							© 2024 PT Fujiyama Technology Solutions. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
