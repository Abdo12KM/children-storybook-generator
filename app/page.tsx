"use client";

import { Button, Card, CardBody } from "@heroui/react";
import { BookOpen, Sparkles, Users, Palette, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function LandingPage() {
  const features = [
    {
      icon: BookOpen,
      title: "Personalized Stories",
      description:
        "Create unique stories tailored to your child's name, age, and interests",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Magic",
      description:
        "Advanced AI generates engaging narratives and beautiful illustrations",
    },
    {
      icon: Palette,
      title: "Multiple Art Styles",
      description:
        "Choose from watercolor, cartoon, realistic, and fantasy art styles",
    },
    {
      icon: Users,
      title: "Age-Appropriate",
      description:
        "Stories adapted for different age groups with appropriate vocabulary",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Your data is protected with enterprise-grade security",
    },
    {
      icon: Zap,
      title: "Instant Generation",
      description: "Get your personalized storybook in just minutes",
    },
  ];

  return (
    <div className="from-background via-background/95 to-primary/5 min-h-screen bg-gradient-to-br">
      {/* Navigation */}
      {/*       <nav className="bg-background/80 flex items-center justify-between border-b p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <BookOpen className="text-primary h-8 w-8" />
          <span className="text-xl font-bold">StorySprout</span>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
          <Link href="/login">
            <Button variant="bordered">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button color="primary">Get Started</Button>
          </Link>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <h1 className="from-primary to-secondary mb-6 bg-gradient-to-r bg-clip-text text-6xl font-bold text-transparent">
            Create Magical Stories for Your Little Ones
          </h1>

          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
            Generate personalized children's storybooks with AI-powered
            narratives and beautiful illustrations. Every story is unique,
            educational, and perfectly tailored to your child.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button
                size="lg"
                color="primary"
                className="px-8 py-3 text-lg font-semibold"
              >
                Start Creating Stories
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="bordered"
                className="px-8 py-3 text-lg"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Demo Story Preview */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">See the Magic in Action</h2>
            <p className="text-muted-foreground text-lg">
              Here's an example of what your personalized storybook could look
              like
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-xl border p-8 shadow-2xl"
          >
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-2xl font-bold">
                  Emma's Magical Forest Adventure
                </h3>
                <p className="text-muted-foreground mb-6">
                  "Once upon a time, there was a brave little girl named Emma
                  who discovered a magical forest behind her grandmother's
                  house. With her new friend, a wise talking owl, Emma learned
                  about friendship and courage..."
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                    Adventure
                  </span>
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                    Friendship
                  </span>
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                    Ages 4-6
                  </span>
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                    Watercolor Style
                  </span>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/demo.png"
                  alt="Demo storybook page"
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="from-primary/20 absolute inset-0 rounded-lg bg-gradient-to-t to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">Why Choose StorySprout?</h2>
            <p className="text-muted-foreground text-lg">
              We combine cutting-edge AI with child development expertise
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardBody className="p-6 text-center">
                    <feature.icon className="text-primary mx-auto mb-4 h-12 w-12" />
                    <h3 className="mb-3 text-xl font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Create your child's perfect story in just 5 simple steps
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-5">
            {[
              {
                step: 1,
                title: "Child Details",
                desc: "Enter your child's name and age",
              },
              {
                step: 2,
                title: "Main Character",
                desc: "Choose the protagonist and traits",
              },
              {
                step: 3,
                title: "Story Setting",
                desc: "Pick the world and theme",
              },
              {
                step: 4,
                title: "Art Style",
                desc: "Select your preferred illustration style",
              },
              {
                step: 5,
                title: "Generate Magic",
                desc: "Watch your story come to life!",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="mb-6 text-4xl font-bold">
            Ready to Create Your Child's First Magical Story?
          </h2>
          <p className="text-muted-foreground mb-8 text-xl">
            Join thousands of parents who are already creating personalized
            storybooks
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              color="primary"
              className="px-8 py-4 text-lg font-semibold"
            >
              Start Your Free Story Today
            </Button>
          </Link>
          <p className="text-muted-foreground mt-4 text-sm">
            No credit card required • Create your first story free
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-background/80 border-t backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center space-x-2 md:mb-0">
              <BookOpen className="text-primary h-6 w-6" />
              <span className="font-semibold">StorySprout</span>
            </div>
            <div className="text-muted-foreground flex space-x-6 text-sm">
              <Link href="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
          <div className="text-muted-foreground mt-6 text-center text-sm">
            © 2025 StorySprout. All rights reserved. Built with ❤️ for creating
            magical stories.
          </div>
        </div>
      </footer>
    </div>
  );
}
