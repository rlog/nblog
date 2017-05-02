pipeline {
  agent none
  stages {
    stage('Print Msg') {
      steps {
        echo 'Build Start'
      }
    }
    stage('Check Node') {
      steps {
        sh 'node -v'
      }
    }
    stage('Install Dep') {
      steps {
        sh 'yarn'
      }
    }
  }
}