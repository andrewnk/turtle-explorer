ARG base_image_version=0.10.0
FROM phusion/baseimage:$base_image_version

ARG TURTLECOIN_BRANCH=master
ENV TURTLECOIN_BRANCH=${TURTLECOIN_BRANCH}

ARG TURTLECOIN_PROGRAM=TurtleCoind
ENV TURTLECOIN_PROGRAM=${TURTLECOIN_PROGRAM}

# install build dependencies
# checkout the latest tag
# build and install
RUN apt-get update && \
    apt-get install -y \
      build-essential \
      python-dev \
      gcc \
      g++ \
      git \
      cmake \
      wget \
      libboost1.58-all-dev && \
    mkdir -p /src/turtlecoin

WORKDIR /src/turtlecoin

RUN git clone -b $TURTLECOIN_BRANCH --single-branch https://github.com/turtlecoin/turtlecoin.git . && \
    mkdir build

WORKDIR /src/turtlecoin/build

RUN cmake -DCMAKE_CXX_FLAGS="-g0 -Os -fPIC -std=gnu++11" .. && \
    make -j$(nproc) $TURTLECOIN_PROGRAM

RUN mkdir -p /usr/local/bin && \
    cp src/$TURTLECOIN_PROGRAM /usr/local/bin/$TURTLECOIN_PROGRAM && \
    strip /usr/local/bin/$TURTLECOIN_PROGRAM

WORKDIR /

RUN useradd -r -s /usr/sbin/nologin -m -d /var/lib/turtlecoind turtlecoind && \
    useradd -s /bin/bash -m -d /home/turtlecoin turtlecoin && \
    mkdir /home/turtlecoin/.TurtleCoin && \
    wget https://github.com/turtlecoin/checkpoints/raw/master/checkpoints.csv -P /home/turtlecoin/.TurtleCoin && \
    chown -R turtlecoin:turtlecoin /home/turtlecoin

RUN rm -rf /src/turtlecoin && \
    apt-get remove -y build-essential python-dev gcc g++ git cmake libboost1.58-all-dev wget && \
    apt-get autoremove -y && \
    apt-get install -y  \
      libboost-system1.58.0 \
      libboost-filesystem1.58.0 \
      libboost-thread1.58.0 \
      libboost-date-time1.58.0 \
      libboost-chrono1.58.0 \
      libboost-regex1.58.0 \
      libboost-serialization1.58.0 \
      libboost-program-options1.58.0 \
      libicu55

USER turtlecoin

EXPOSE 11897 11898

CMD ["TurtleCoind", "--load-checkpoints", "/home/turtlecoin/.TurtleCoin/checkpoints.csv", "--enable_blockexplorer", "--rpc-bind-ip=0.0.0.0", "--rpc-bind-port=11898", "--enable-cors=*"]
