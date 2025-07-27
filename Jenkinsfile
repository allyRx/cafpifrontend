pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'your-docker-registry'
        DOCKER_CREDENTIALS = 'your-docker-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    docker.build('myapp-backend-prod', '-f backend/Dockerfile ../backend')
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    docker.build('myapp-frontend-prod', '-f frontend/Dockerfile .')
                }
            }
        }

        stage('Test') {
            steps {
                // Add your test commands here
                sh 'echo "Running tests..."'
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", DOCKER_CREDENTIALS) {
                        docker.image('myapp-backend-prod').push("${env.BUILD_NUMBER}")
                        docker.image('myapp-backend-prod').push("latest")
                        docker.image('myapp-frontend-prod').push("${env.BUILD_NUMBER}")
                        docker.image('myapp-frontend-prod').push("latest")
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Add your deployment commands here
                    sh 'docker-compose -f docker-compose.yml up -d'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
