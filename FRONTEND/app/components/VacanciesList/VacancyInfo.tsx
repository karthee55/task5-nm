import {VacaniesService} from "@/api/services/VacanciesService";
import share from "@/assets/img/share.png";
import back from "@/assets/img/back.png";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { IVacancy } from "@/api/models/IVacancy";
import SkeletonVacancyInfo from "./SkeletonVacancyInfo";
import { Button, message } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { navSlice } from "@/store/reducers/navSlice";

type Props = {
  id: string;
};

const VacancyInfo = ({ id }: Props) => {
  const [vacancy, setVacancy] = useState<IVacancy>();
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [date, setDate] = useState("");
  const { auth, user } = useAppSelector((state) => state.authReducer);
  const { active } = useAppSelector((state) => state.navReducer);
  const { setActive } = navSlice.actions;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleApply = () => {
    if (auth) {
      setLoadingButton(true);
      VacaniesService.response(user.email, id).then((res) => {
        message.success("Your resume has been sent");
        setLoadingButton(false);
        dispatch(setActive(false));
      });
      VacaniesService.responseUser(user.email, id);
    } else {
      router.push("/auth/login");
    }
  };

  const onLoad = (data: IVacancy) => {
    setVacancy(data);
    setLoading(false);
    const vacancyDate = new Date(data.createdAt);
    setDate(
      `${vacancyDate.getDate() + 1 < 10 ? "0" : ""}${
        vacancyDate.getDate() + 1
      }.${vacancyDate.getMonth() + 1 < 10 ? "0" : ""}${
        vacancyDate.getMonth() + 1
      }`
    );
  };

  const closeVacancy = () => dispatch(setActive(false));
  const shareVacancy = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success("link in clipboard");
  };

  useEffect(() => {
    setLoading(true);
    if (id !== "serch") {
      VacaniesService.getOneById(id)
        .then((res) => onLoad(res.data))
        .catch((e) => console.log(e));
    }
  }, [id]);

  if (loading) {
    return <SkeletonVacancyInfo />;
  }
  return (
    <div  id="vacancyPage" className={`vacancyPage ${!active ? "mobileVacancy" : ""}`}>
      <div className="additionalButtons">
        <div className="backButton" onClick={() => closeVacancy()}>
          <Image
            src={back}
            width={30}
            height={30}
            alt="back"
            draggable={false}
          />
        </div>
        <div className="backButton" onClick={() => shareVacancy()}>
          <Image
            src={share}
            width={30}
            height={30}
            alt="back"
            draggable={false}
          />
        </div>
      </div>
      <div className="vacancyInfo">
        <div id="header" className="header">
          <Image
            src={vacancy ? vacancy?.logo : ""}
            loader={() => (vacancy ? vacancy?.logo : "")}
            width={75}
            height={75}
            alt="logo"
            draggable={false}
          />
          <div className="headerInfo">
            <h2>{vacancy?.postionName}</h2>
            <p>
              {vacancy?.workLocation} - {vacancy?.companyName}
            </p>
            <p>
              {vacancy?.maxSalary === vacancy?.minSalary
                ? `${vacancy?.maxSalary}`
                : `${vacancy?.minSalary}-${vacancy?.maxSalary}`}
              $/month - {vacancy?.employmentType}
            </p>
          </div>
        </div>
        <main>
          <div>
            <h3>
              <b>Tech skills:</b>
            </h3>
            <div className="techSkillsList">
              {vacancy?.techStack?.map((e, i) => (
                <p id={`item-${i}`} key={i}>{e}</p>
              ))}
            </div>
          </div>
          <div>
            <h3>
              <b>Company size:</b> {vacancy?.companySize}
            </h3>
          </div>
          <div>
            <h3>
              <b>Placement date:</b> {date}
            </h3>
            <p></p>
          </div>
          <div id="description">
            <h3>
              <b>Description:</b>
            </h3>
            <p>{vacancy?.jobDescription}</p>
          </div>
        </main>
      </div>
      <div className="confirm">
        <p>
          {vacancy?.maxSalary === vacancy?.minSalary
            ? `${vacancy?.maxSalary}`
            : `${vacancy?.minSalary}-${vacancy?.maxSalary}`}
          $/month
        </p>
        <Button
          size="large"
          type="text"
          loading={loadingButton}
          onClick={() => handleApply()}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default VacancyInfo;
